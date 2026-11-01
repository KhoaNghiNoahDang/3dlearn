#!/usr/bin/env node

/**
 * Read-only SGK OCR preparation pipeline.
 *
 * It never edits SGK PDFs, catalog.json, or content/course-mapping.json.
 * It only discovers local tools, renders selected PDF pages, stores optional
 * raw OCR text, and emits conservative records with null curriculum fields
 * until a human/OCR review provides direct evidence.
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const defaultOutput = resolve(root, 'docs/ocr/physics');
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

const subject = option('--subject', 'physics');
const inputDir = resolve(root, option('--input-dir', 'SGK'));
const outputDir = resolve(root, option('--output-dir', `docs/ocr/${subject}`));
const pagesSpec = option('--pages', '1-12');
const runId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const runDir = join(outputDir, 'runs', runId);

const recordSchema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  title: '3D Learn SGK OCR evidence record',
  type: 'object',
  additionalProperties: false,
  required: ['sourceBookId', 'chapter', 'lesson', 'printedPage', 'figureRef', 'confidence'],
  properties: {
    sourceBookId: { type: 'string', minLength: 1 },
    chapter: { type: ['string', 'null'] },
    lesson: { type: ['string', 'null'] },
    printedPage: { type: ['integer', 'null'], minimum: 1 },
    figureRef: { type: ['string', 'null'] },
    confidence: {
      type: 'string',
      enum: ['unverified', 'low', 'medium', 'high', 'confirmed'],
    },
  },
};

function commandPath(command) {
  const lookup = process.platform === 'win32' ? 'where.exe' : 'which';
  const result = spawnSync(lookup, [command], { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) return null;
  return String(result.stdout || '').split(/\r?\n/).map((line) => line.trim()).find(Boolean) || null;
}

function pythonModule(moduleName) {
  const python = commandPath('python') || commandPath('python3');
  if (!python) return { available: false, executable: null };
  const result = spawnSync(python, ['-c', `import ${moduleName}`], {
    encoding: 'utf8',
    windowsHide: true,
  });
  return { available: result.status === 0, executable: python };
}

function parsePages(spec, pageCount) {
  const pages = new Set();
  for (const part of String(spec).split(',')) {
    const value = part.trim();
    if (!value) continue;
    const range = value.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Math.min(Number(range[1]), Number(range[2]));
      const end = Math.max(Number(range[1]), Number(range[2]));
      for (let page = start; page <= end; page += 1) if (page <= pageCount) pages.add(page);
      continue;
    }
    const page = Number(value);
    if (Number.isInteger(page) && page >= 1 && page <= pageCount) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

function sourceBookIdFromFile(fileName, books) {
  const normalized = fileName.toLowerCase().replace(/\s+/g, ' ');
  return books.find((book) => book.sourcePath && normalized === basename(book.sourcePath).toLowerCase())?.id || null;
}

function pdfInfo(pdfPath) {
  const executable = commandPath('pdfinfo');
  if (!executable) return { available: false, pages: null, error: 'pdfinfo not found' };
  const result = spawnSync(executable, [pdfPath], { encoding: 'utf8', windowsHide: true });
  const match = String(result.stdout || '').match(/^Pages:\s*(\d+)/mi);
  return {
    available: result.status === 0,
    pages: match ? Number(match[1]) : null,
    error: result.status === 0 ? null : String(result.stderr || 'pdfinfo failed').trim(),
  };
}

async function renderPage(pdftoppm, pdfPath, destination, page) {
  await mkdir(dirname(destination), { recursive: true });
  const prefix = destination.slice(0, -extname(destination).length);
  const result = spawnSync(pdftoppm, ['-f', String(page), '-l', String(page), '-singlefile', '-jpeg', '-r', '150', pdfPath, prefix], {
    encoding: 'utf8',
    windowsHide: true,
  });
  const generated = destination;
  if (result.status !== 0 || !existsSync(generated)) {
    return { ok: false, error: String(result.stderr || 'pdftoppm failed').trim() };
  }
  return { ok: true, file: generated };
}

function runTesseract(tesseract, imagePath, textPath) {
  const result = spawnSync(tesseract, [imagePath, textPath.slice(0, -extname(textPath).length), '-l', 'vie+eng', '--psm', '6'], {
    encoding: 'utf8',
    windowsHide: true,
  });
  const output = `${textPath.slice(0, -extname(textPath).length)}.txt`;
  return {
    ok: result.status === 0 && existsSync(output),
    file: existsSync(output) ? output : null,
    error: result.status === 0 ? null : String(result.stderr || 'tesseract failed').trim(),
  };
}

async function main() {
  const manifestPath = resolve(root, 'content/manifest.json');
  const contentManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const books = (contentManifest.books || []).filter((book) => book.subject === 'Vật lí');
  const pdfFiles = await readdir(inputDir, { withFileTypes: true });
  const selected = pdfFiles
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.pdf'))
    .map((entry) => entry.name)
    .filter((name) => sourceBookIdFromFile(name, books));

  const tools = {
    pdfinfo: commandPath('pdfinfo'),
    pdftoppm: commandPath('pdftoppm'),
    tesseract: commandPath('tesseract'),
    python: commandPath('python') || commandPath('python3'),
    pythonModules: {
      fitz: pythonModule('fitz'),
      pypdf: pythonModule('pypdf'),
      pdfplumber: pythonModule('pdfplumber'),
      pytesseract: pythonModule('pytesseract'),
    },
  };

  await mkdir(runDir, { recursive: true });
  await writeFile(join(runDir, 'record.schema.json'), `${JSON.stringify(recordSchema, null, 2)}\n`, 'utf8');

  const booksReport = [];
  const records = [];
  for (const fileName of selected) {
    const sourceBookId = sourceBookIdFromFile(fileName, books);
    const pdfPath = resolve(inputDir, fileName);
    const info = pdfInfo(pdfPath);
    const pages = info.pages ? parsePages(pagesSpec, info.pages) : [];
    const bookDir = join(runDir, sourceBookId || 'unknown-book');
    const rendered = [];
    const ocr = [];

    for (const page of pages) {
      const imageDestination = join(bookDir, `page-${String(page).padStart(3, '0')}.jpg`);
      const render = tools.pdftoppm
        ? await renderPage(tools.pdftoppm, pdfPath, imageDestination, page)
        : { ok: false, error: 'pdftoppm not found' };
      rendered.push({ pdfPage: page, ...render });
      if (render.ok && tools.tesseract) {
        const textDestination = join(bookDir, `page-${String(page).padStart(3, '0')}.txt`);
        ocr.push({ pdfPage: page, ...runTesseract(tools.tesseract, render.file, textDestination) });
      }
      // Deliberately create no curriculum record from OCR text automatically.
      // Names, chapter/lesson links, printed pages and figures require review.
    }

    booksReport.push({
      sourceBookId,
      file: fileName,
      pdfPath: `SGK/${fileName}`,
      pageCount: info.pages,
      info,
      selectedPdfPages: pages,
      rendered,
      ocr,
      reviewStatus: 'needs-human-review',
    });
  }

  const run = {
    schemaVersion: 1,
    pipeline: '3dlearn-sgk-ocr-prep',
    subject,
    createdAt: new Date().toISOString(),
    readOnly: true,
    inputDirectory: 'SGK',
    outputDirectory: `docs/ocr/${subject}/runs/${runId}`,
    pageSelection: pagesSpec,
    tools,
    books: booksReport,
    recordsFile: 'records.jsonl',
    notes: [
      'OCR output is raw evidence only; no chapter, lesson, printedPage, figureRef, or name was inferred.',
      'Empty records.jsonl is intentional until a reviewer confirms source page evidence.',
      'PDF page numbers are physical PDF indexes. printedPage must be filled only from visible page-number evidence.',
    ],
  };

  await writeFile(join(runDir, 'run.json'), `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  await writeFile(join(runDir, 'records.jsonl'), records.map((record) => JSON.stringify(record)).join('\n') + (records.length ? '\n' : ''), 'utf8');
  await writeFile(join(outputDir, 'latest.json'), `${JSON.stringify({ runId, run: `runs/${runId}/run.json`, schema: `runs/${runId}/record.schema.json`, records: `runs/${runId}/records.jsonl` }, null, 2)}\n`, 'utf8');

  console.log(`OCR prep completed: ${runDir}`);
  console.log(`  physics PDFs: ${selected.length}`);
  console.log(`  pdftoppm: ${tools.pdftoppm ? 'available' : 'missing'}`);
  console.log(`  tesseract: ${tools.tesseract ? 'available' : 'missing; raw OCR skipped'}`);
  console.log(`  records: ${records.length} (none inferred)`);
}

await main();
