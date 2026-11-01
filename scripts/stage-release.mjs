import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative, join, sep, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const packageJsonPath = resolve(root, 'package.json');
const validateOnly = process.argv.includes('--validate-only');

const publicCopies = [
  ['courses', 'courses'],
  ['scripts/bridge/legacy-bridge.js', 'bridge/legacy-bridge.js'],
  ['covers', 'covers'],
  ['content', 'content'],
  ['catalog.json', 'catalog.json'],
  ['app/legacy/manifest.json', 'app/legacy/manifest.json'],
  ['cell/public', 'cell/public'],
  ['index.html', 'index.html'],
];

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const gitCommit = getGitCommit();
const timestamp = new Date().toISOString();
const version = process.env.RELEASE_VERSION || `${packageJson.version}+${timestamp.replace(/[-:.TZ]/g, '').slice(0, 14)}`;

if (!validateOnly) {
  if (!existsSync(dist)) {
    throw new Error('dist does not exist. Run `npm run build` or `vite build` first.');
  }

  for (const [, destination] of publicCopies) {
    await rm(resolve(dist, destination), { recursive: true, force: true });
  }

  for (const [source, destination] of publicCopies) {
    const sourcePath = resolve(root, source);
    const destinationPath = resolve(dist, destination);
    await mkdir(resolve(destinationPath, '..'), { recursive: true });
    await cp(sourcePath, destinationPath, { recursive: true, force: true });
  }

  // Keep the legacy lessons source-compatible while adding the bridge at
  // release time. The marker prevents duplicate injection on repeated runs.
  const courseRoot = resolve(dist, 'courses');
  const courseFiles = await findFiles(courseRoot, (file) => file.toLowerCase().endsWith('.html'));
  for (const courseFile of courseFiles) {
    const absolute = resolve(dist, courseFile);
    const html = await readFile(absolute, 'utf8');
    if (html.includes('data-3dlearn-legacy-bridge')) continue;
    const bridgeTag = '<script data-3dlearn-legacy-bridge src="/bridge/legacy-bridge.js"></script>';
    const nextHtml = html.includes('</body>')
      ? html.replace('</body>', `${bridgeTag}</body>`)
      : `${html}\n${bridgeTag}\n`;
    await writeFile(absolute, nextHtml, 'utf8');
  }

  const manifest = {
    schemaVersion: 1,
    releaseVersion: version,
    appVersion: packageJson.version,
    gitCommit,
    builtAt: timestamp,
    outputDirectory: 'dist',
    included: [
      'app/**',
      'app/assets/**',
      'courses/**',
      'bridge/legacy-bridge.js',
      'covers/**',
      'content/**',
      'catalog.json',
      'app/legacy/manifest.json',
    ],
    excluded: ['SGK/**/*.pdf', 'node_modules/**', '.git/**', '_viethoa/**'],
    notes: 'SGK source PDFs are intentionally excluded from the frontend release.',
  };

  await writeFile(
    resolve(dist, 'release-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
}

await validateRelease();

function getGitCommit() {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim() || null;
  } catch {
    return null;
  }
}

async function validateRelease() {
  const required = [
    'app/index.html',
    'courses/capacitor-step.html',
    'covers/capacitor-step.webp',
    'catalog.json',
    'content/manifest.json',
    'content/course-mapping.json',
    'app/legacy/manifest.json',
    'release-manifest.json',
  ];

  const missing = required.filter((entry) => !existsSync(resolve(dist, entry)));
  if (missing.length > 0) {
    throw new Error(`Release validation failed. Missing: ${missing.join(', ')}`);
  }

  const pdfs = await findFiles(dist, (file) => file.toLowerCase().endsWith('.pdf'));
  if (pdfs.length > 0) {
    throw new Error(`Release validation failed. PDF files must not be in dist: ${pdfs.join(', ')}`);
  }

  const courseFiles = await findFiles(
    resolve(dist, 'courses'),
    (file) => file.endsWith('.html') && basename(file).toLowerCase() !== 'index.html',
  );
  const coverFiles = await findFiles(resolve(dist, 'covers'), (file) => /\.(webp|png|jpe?g)$/i.test(file));
  const manifest = JSON.parse(await readFile(resolve(dist, 'release-manifest.json'), 'utf8'));

  if (courseFiles.length < 54) {
    throw new Error(`Release validation failed. Expected at least 54 course HTML files, found ${courseFiles.length}.`);
  }
  if (coverFiles.length < 54) {
    throw new Error(`Release validation failed. Expected at least 54 cover images, found ${coverFiles.length}.`);
  }
  if (!manifest.releaseVersion || !manifest.builtAt) {
    throw new Error('Release validation failed. release-manifest.json has no version or build timestamp.');
  }

  console.log(`Release validated: ${manifest.releaseVersion}`);
  console.log(`  courses: ${courseFiles.length}`);
  console.log(`  covers: ${coverFiles.length}`);
  console.log('  PDFs: 0 (excluded)');
}

async function findFiles(directory, predicate) {
  if (!existsSync(directory)) return [];
  const results = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...await findFiles(absolute, predicate));
    } else if (predicate(absolute)) {
      results.push(relative(dist, absolute).split(sep).join('/'));
    }
  }
  return results.sort();
}
