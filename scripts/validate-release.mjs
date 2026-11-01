#!/usr/bin/env node

/** Validate a production artifact without installing dependencies. */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const artifactRoot = path.resolve(option('--artifact', 'dist'));
const sourceRoot = path.resolve(option('--source', '.'));
const jsonOutput = args.includes('--json');
const failures = [];
const warnings = [];
const checks = [];

function filesUnder(relativePath, root = artifactRoot) {
  const directory = path.join(root, relativePath);
  if (!fs.existsSync(directory)) return [];
  const result = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else result.push(path.relative(directory, fullPath));
    }
  };
  visit(directory);
  return result;
}

function exists(relativePath, root = artifactRoot) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(name, passed, detail, level = 'error') {
  const record = { name, passed, detail, level };
  checks.push(record);
  if (!passed && level === 'error') failures.push(record);
  if (!passed && level === 'warning') warnings.push(record);
}

function readJson(relativePath, root, label) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  } catch (error) {
    check(label, false, `${relativePath}: ${error.message}`);
    return null;
  }
}

function expectedSlugs() {
  const catalog = readJson('catalog.json', sourceRoot, 'Source catalog readable');
  const courses = Array.isArray(catalog) ? catalog : catalog?.courses;
  if (!courses) {
    check('Source catalog contains courses', false, 'catalog.json must be an array or contain a courses array');
    return [];
  }
  const slugs = [...new Set(courses.map((course) => course.slug).filter(Boolean))].sort();
  check('Source catalog has valid legacy lessons', slugs.length >= 54, `${slugs.length} course slugs found`);
  return slugs;
}

function checkDirectories() {
  for (const directory of ['app', 'courses', 'covers']) {
    check(`Artifact directory: ${directory}`, exists(directory), `${artifactRoot}${path.sep}${directory}`);
  }
}

function checkApp() {
  const entry = ['app/index.html', 'index.html'].find((candidate) => exists(candidate));
  check('App HTML entry exists', Boolean(entry), entry ?? 'Expected app/index.html or index.html');
  const compiled = [...filesUnder('app'), ...filesUnder('assets')].filter((file) => /\.(html|js|css)$/i.test(file));
  check('App contains compiled HTML/JS/CSS', compiled.some((file) => /\.(js|css)$/i.test(file)), `${compiled.length} compiled files found`);
  check('Has hashed production bundles', filesUnder('assets').some((file) => /\.(js|css)$/i.test(file)), `${filesUnder('assets').length} asset files found`);
}

function checkManifests() {
  const required = ['content/manifest.json', 'content/course-mapping.json', 'app/legacy/manifest.json'];
  const found = required.filter((candidate) => exists(candidate));
  check('Runtime manifests exist', found.length === required.length, `Found ${found.length}/${required.length}`);
  for (const candidate of found) readJson(candidate, artifactRoot, `Manifest JSON valid: ${candidate}`);
}

function checkLegacy(slugs) {
  const html = filesUnder('courses').filter((file) => file.toLowerCase().endsWith('.html') && file.toLowerCase() !== 'index.html');
  const covers = filesUnder('covers').filter((file) => /\.(webp|png|jpe?g|avif)$/i.test(file));
  check('Legacy HTML files count is at least 54', html.length >= 54, `${html.length} HTML files found`);
  check('Cover image files count is at least 54', covers.length >= 54, `${covers.length} image files found`);
  const missingHtml = slugs.filter((slug) => !exists(`courses/${slug}.html`));
  const missingCovers = slugs.filter((slug) => !exists(`covers/${slug}.webp`) && !exists(`covers/${slug}.png`));
  check('Every catalog lesson has an HTML entry', missingHtml.length === 0, missingHtml.length ? `Missing: ${missingHtml.join(', ')}` : `${slugs.length} entries present`);
  check('Every catalog lesson has a cover', missingCovers.length === 0, missingCovers.length ? `Missing: ${missingCovers.join(', ')}` : `${slugs.length} covers present`);
}

function checkRuntimeBridge() {
  const bridgePath = 'bridge/legacy-bridge.js';
  const bridge = exists(bridgePath) ? fs.readFileSync(path.join(artifactRoot, bridgePath), 'utf8') : '';
  check('Legacy bridge asset exists', Boolean(bridge), bridgePath);
  check('Legacy bridge protocol is present', bridge.includes('3dlearn:legacy-bridge'), 'Expected protocol marker in bridge asset');

  const courseFiles = filesUnder('courses').filter((file) => file.toLowerCase().endsWith('.html') && file.toLowerCase() !== 'index.html').sort();
  const missingBridge = courseFiles.filter((file) => {
    const html = fs.readFileSync(path.join(artifactRoot, 'courses', file), 'utf8');
    return !html.includes('data-3dlearn-legacy-bridge') || !html.includes('/bridge/legacy-bridge.js');
  });
  check('Every legacy course has the bridge injected', missingBridge.length === 0, missingBridge.length ? `Missing: ${missingBridge.join(', ')}` : `${courseFiles.length} entries reference the bridge`);

  checkRuntimeAssetReferences();
}

function checkRuntimeAssetReferences() {
  const htmlFiles = filesUnder('.').filter((file) => /\.html$/i.test(file));
  const cssFiles = filesUnder('.').filter((file) => /\.css$/i.test(file));
  const references = [];

  for (const relativeFile of [...htmlFiles, ...cssFiles]) {
    const absoluteFile = path.join(artifactRoot, relativeFile);
    const content = fs.readFileSync(absoluteFile, 'utf8');
    const sourceDirectory = path.dirname(relativeFile);
    // Only inspect real HTML tags. Legacy lessons contain large inline
    // JavaScript bundles whose strings frequently include `href=`/`src=` and
    // CSS-like snippets; scanning the whole document creates false positives.
    const markup = relativeFile.toLowerCase().endsWith('.html')
      ? content
        .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, '<script$1></script>')
        .replace(/<style\b([^>]*)>[\s\S]*?<\/style>/gi, '<style$1></style>')
      : '';
    const htmlRefs = [...markup.matchAll(/<(?:link|script|img|source|iframe|video|audio)[^>]+(?:src|href)=["']([^"'#]+)["'][^>]*>/gi)].map((match) => match[1]);
    const cssRefs = [...(relativeFile.toLowerCase().endsWith('.css') ? content : '').matchAll(/url\(\s*["']?([^"')#]+)["']?\s*\)/gi)].map((match) => match[1]);
    for (const reference of [...htmlRefs, ...cssRefs]) {
      if (!reference || reference.startsWith('data:') || reference.startsWith('blob:') || reference.startsWith('http:') || reference.startsWith('https:') || reference.startsWith('//') || reference.startsWith('#')) continue;
      references.push({ from: relativeFile, reference, sourceDirectory });
    }
  }

  const missing = references.filter(({ reference, sourceDirectory }) => {
    const normalized = reference.startsWith('/')
      ? reference.slice(1)
      : path.normalize(path.join(sourceDirectory, reference));
    return !exists(normalized.replace(/\\/g, '/'));
  });
  const detail = missing.length
    ? `Missing: ${missing.slice(0, 20).map(({ from, reference }) => `${from} -> ${reference}`).join(', ')}`
    : `${references.length} local references resolve`;
  check('All local HTML/CSS asset references resolve', missing.length === 0, detail);
}

function checkNoPdf() {
  const pdfs = filesUnder('.').filter((file) => /\.pdf$/i.test(file));
  check('Artifact contains no SGK PDFs', pdfs.length === 0, pdfs.length ? `Found: ${pdfs.slice(0, 10).join(', ')}` : 'No PDF files found');
}

function checkNoSensitiveFiles() {
  const sensitive = filesUnder('.').filter((file) => /(^|[\\/])(?:\.env(?:\.|$)|\.git(?:[\\/]|$)|node_modules(?:[\\/]|$))/i.test(file));
  check('Artifact contains no private/build source directories', sensitive.length === 0, sensitive.length ? `Found: ${sensitive.slice(0, 10).join(', ')}` : 'No private source directories found', 'warning');
}

if (fs.existsSync(artifactRoot)) await waitForArtifactReady();

if (!fs.existsSync(artifactRoot)) {
  check('Artifact root exists', false, `Directory not found: ${artifactRoot}`);
} else {
  check('Artifact root exists', true, artifactRoot);
  const slugs = expectedSlugs();
  checkDirectories();
  checkApp();
  checkManifests();
  checkLegacy(slugs);
  checkRuntimeBridge();
  checkNoPdf();
  checkNoSensitiveFiles();
}

const report = { artifactRoot, sourceRoot, passed: failures.length === 0, errorCount: failures.length, warningCount: warnings.length, checks };
if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Release validation: ${report.passed ? 'PASS' : 'FAIL'}`);
  console.log(`Artifact: ${artifactRoot}`);
  for (const result of checks) console.log(`[${result.passed ? 'OK' : result.level === 'warning' ? 'WARN' : 'FAIL'}] ${result.name} — ${result.detail}`);
  if (warnings.length) console.log(`Warnings: ${warnings.length}`);
  if (failures.length) console.log(`Errors: ${failures.length}`);
}
process.exitCode = failures.length ? 1 : 0;

async function waitForArtifactReady() {
  const required = [
    'app/index.html',
    'courses/capacitor-step.html',
    'covers/capacitor-step.webp',
    'catalog.json',
    'content/manifest.json',
    'content/course-mapping.json',
    'app/legacy/manifest.json',
    'bridge/legacy-bridge.js',
    'release-manifest.json',
  ];
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (required.every((entry) => exists(entry))) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
