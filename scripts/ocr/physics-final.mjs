#!/usr/bin/env node

/**
 * Conservative Phase 2 preparation for Physics SGK.
 *
 * Read-only with respect to SGK PDFs and shared curriculum data. It produces
 * a separate final OCR audit directory and never writes catalog/mapping files.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const inputDir = resolve(root, 'SGK');
const outputDir = resolve(root, 'docs/ocr/physics-final');
const pagesDir = join(outputDir, 'pages');
const runId = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

function commandPath(command) {
  const lookup = process.platform === 'win32' ? 'where.exe' : 'which';
  const result = spawnSync(lookup, [command], { encoding: 'utf8', windowsHide: true });
  return result.status === 0 ? String(result.stdout || '').split(/\r?\n/).map((x) => x.trim()).find(Boolean) || null : null;
}

function pythonModule(moduleName) {
  const python = commandPath('python') || commandPath('python3');
  if (!python) return false;
  return spawnSync(python, ['-c', `import ${moduleName}`], { encoding: 'utf8', windowsHide: true }).status === 0;
}

function pdfInfo(pdfPath) {
  const pdfinfo = commandPath('pdfinfo');
  if (!pdfinfo) return { pages: null, error: 'pdfinfo unavailable' };
  const result = spawnSync(pdfinfo, [pdfPath], { encoding: 'utf8', windowsHide: true });
  const match = String(result.stdout || '').match(/^Pages:\s*(\d+)/mi);
  return { pages: match ? Number(match[1]) : null, error: match ? null : String(result.stderr || 'unknown pdfinfo error').trim() };
}

function bookIdFor(file, books) {
  const normalized = file.toLowerCase().replace(/\s+/g, ' ');
  return books.find((book) => basename(book.sourcePath).toLowerCase().replace(/\s+/g, ' ') === normalized)?.id || null;
}

function renderPdf(pdfPath, outputPrefix) {
  const pdftoppm = commandPath('pdftoppm');
  if (!pdftoppm) return { available: false, rendered: false, error: 'pdftoppm unavailable' };
  const result = spawnSync(pdftoppm, ['-jpeg', '-r', '72', pdfPath, outputPrefix], {
    encoding: 'utf8',
    windowsHide: true,
  });
  return {
    available: true,
    rendered: result.status === 0,
    error: result.status === 0 ? null : String(result.stderr || 'pdftoppm failed').trim(),
  };
}

function csvCell(value) {
  const text = value == null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function main() {
  const manifest = JSON.parse(await readFile(resolve(root, 'content/manifest.json'), 'utf8'));
  const catalog = JSON.parse(await readFile(resolve(root, 'catalog.json'), 'utf8'));
  const courseMapping = JSON.parse(await readFile(resolve(root, 'content/course-mapping.json'), 'utf8'));
  const physicsBooks = manifest.books.filter((book) => book.subject === 'Vật lí');
  const physicsSlugs = catalog.filter((course) => course.subject === 'phys');
  const mappingBySlug = new Map(courseMapping.courses.filter((course) => course.legacySubject === 'phys').map((course) => [course.courseSlug, course]));

  const tools = {
    pdfinfo: commandPath('pdfinfo'),
    pdftoppm: commandPath('pdftoppm'),
    tesseract: commandPath('tesseract'),
    python: commandPath('python') || commandPath('python3'),
    pythonModules: {
      fitz: pythonModule('fitz'),
      pytesseract: pythonModule('pytesseract'),
      easyocr: pythonModule('easyocr'),
      rapidocr: pythonModule('rapidocr_onnxruntime'),
    },
    ocrAvailable: Boolean(commandPath('tesseract') || pythonModule('pytesseract') || pythonModule('easyocr') || pythonModule('rapidocr_onnxruntime')),
  };

  await mkdir(pagesDir, { recursive: true });
  const pdfEntries = await readdir(inputDir, { withFileTypes: true });
  const books = [];
  for (const book of physicsBooks) {
    const file = basename(book.sourcePath);
    const path = resolve(inputDir, file);
    const info = pdfInfo(path);
    const outputPrefix = join(pagesDir, book.id, 'page');
    await mkdir(join(pagesDir, book.id), { recursive: true });
    const render = existsSync(path) ? renderPdf(path, outputPrefix) : { available: Boolean(commandPath('pdftoppm')), rendered: false, error: 'PDF missing' };
    books.push({
      sourceBookId: book.id,
      file,
      path: `SGK/${file}`,
      pageCount: info.pages,
      pdfInfo: info,
      render,
      ocrStatus: tools.ocrAvailable ? 'available-but-not-auto-accepted' : 'unavailable',
      reviewStatus: 'needs-human-review',
    });
  }

  // Mapping is intentionally null for curriculum fields. Existing catalog
  // titles are labeled catalog-only and are not promoted to official SGK names.
  const mapping = physicsSlugs.map((course) => {
    const source = mappingBySlug.get(course.slug);
    return {
      sourceBookId: source?.candidateBookIds?.length === 1 ? source.candidateBookIds[0] : null,
      slug: course.slug,
      catalogTitle: course.title,
      chapter: null,
      lesson: null,
      printedPage: null,
      confidence: 'needs-OCR',
      evidence: {
        source: ['catalog.json', 'content/course-mapping.json'],
        titleStatus: 'catalog-only-not-official-SGK-name',
        pdfPage: null,
        figureRef: null,
      },
    };
  });

  const report = {
    schemaVersion: 1,
    runId,
    generatedAt: new Date().toISOString(),
    subject: 'Vật lí',
    readOnly: true,
    inputDirectory: 'SGK',
    outputDirectory: 'docs/ocr/physics-final',
    tools,
    books,
    mappingFile: 'mapping.json',
    mappingCount: mapping.length,
    namingPatch: null,
    notes: [
      'PDFs are scanned/image-only sources in the current workspace; no official SGK name was inferred.',
      'The mapping table intentionally leaves chapter, lesson and printedPage null until OCR/human review supplies direct evidence.',
      'Rendered page indexes are physical PDF pages; printedPage is a separate field and remains null.',
      'No catalog.json or content/course-mapping.json file was modified.',
    ],
  };

  const header = ['sourceBookId', 'slug', 'catalogTitle', 'chapter', 'lesson', 'printedPage', 'confidence'];
  const csv = [header.join(','), ...mapping.map((row) => header.map((key) => csvCell(row[key])).join(','))].join('\n') + '\n';
  await writeFile(join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(join(outputDir, 'mapping.json'), `${JSON.stringify(mapping, null, 2)}\n`, 'utf8');
  await writeFile(join(outputDir, 'mapping.csv'), csv, 'utf8');
  const readme = [
    '# Physics final OCR audit',
    '',
    `Run: ${runId}`,
    '',
    '- Rendered PDF pages are under [pages](./pages).',
    '- Mapping: [mapping.json](./mapping.json) and [mapping.csv](./mapping.csv).',
    `- OCR status: **${tools.ocrAvailable ? 'available but not auto-accepted' : 'unavailable'}**.`,
    '- No naming patch was created because no official SGK title was verified with OCR evidence in this run.',
    '- catalog.json and content/course-mapping.json were not modified.',
    '',
  ].join('\n');
  await writeFile(join(outputDir, 'README.md'), readme, 'utf8');

  console.log(`Physics final OCR audit: ${outputDir}`);
  console.log(`  books: ${books.length}; mapping rows: ${mapping.length}`);
  console.log(`  pdftoppm: ${tools.pdftoppm ? 'available' : 'missing'}`);
  console.log(`  OCR: ${tools.ocrAvailable ? 'available but not auto-accepted' : 'unavailable'}`);
  console.log('  naming patch: none (no official title verified)');
}

await main();
