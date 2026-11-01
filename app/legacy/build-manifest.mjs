import { readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const catalogPath = resolve(root, 'catalog.json');
const coursesDir = resolve(root, 'courses');
const outputPath = resolve(here, 'manifest.json');

const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const htmlFiles = (await readdir(coursesDir))
  .filter((name) => name.endsWith('.html') && name !== 'index.html')
  .sort();
const htmlBySlug = new Map(htmlFiles.map((name) => [basename(name, '.html'), name]));

if (!Array.isArray(catalog)) throw new Error('catalog.json must contain an array.');
if (catalog.length !== htmlFiles.length) {
  throw new Error(`Catalog/course count mismatch: catalog=${catalog.length}, html=${htmlFiles.length}`);
}

const lessons = catalog.map((entry) => {
  const slug = String(entry.slug || '').trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Unsafe slug: ${entry.slug}`);
  const fileName = htmlBySlug.get(slug);
  if (!fileName) throw new Error(`Missing course HTML for slug: ${slug}`);

  return {
    id: `legacy:${slug}`,
    slug,
    title: entry.title,
    subject: entry.subject,
    type: entry.type,
    question: entry.question,
    steps: Array.isArray(entry.steps) ? entry.steps : [],
    source: {
      catalogFile: 'catalog.json',
      htmlFile: `courses/${fileName}`,
      cover: entry.cover || null,
      textbook: Array.isArray(entry.textbook) ? entry.textbook : [],
    },
    launch: {
      path: `/courses/${encodeURIComponent(slug)}.html`,
      route: `/legacy/${encodeURIComponent(slug)}`,
      mode: 'iframe',
    },
    curriculum: {
      status: 'needs-book-page-mapping',
      sourceBooks: [],
      note: 'Legacy catalog references are retained as hints; verify chapter and page against SGK PDFs before presenting as the Vietnamese curriculum source of truth.',
    },
  };
});

const actualSlugs = new Set(htmlBySlug.keys());
for (const entry of catalog) actualSlugs.delete(entry.slug);
if (actualSlugs.size) throw new Error(`Uncatalogued course HTML: ${[...actualSlugs].join(', ')}`);

const manifest = {
  schemaVersion: 1,
  generatedFrom: {
    catalog: 'catalog.json',
    coursesDirectory: 'courses/',
  },
  compatibility: {
    kind: 'self-contained-html',
    defaultMode: 'iframe',
    routePrefix: '/legacy',
    coursePath: '/courses/{slug}.html',
    protectedFiles: ['courses/*.html', 'content/**'],
    note: 'The adapter resolves only slugs present in this manifest and never accepts an arbitrary path.',
  },
  curriculum: {
    booksDirectory: 'SGK/',
    mappingStatus: 'pending',
    note: 'The legacy lesson catalog is useful for candidate topics, but SGK chapter/page alignment must be reviewed from the Vietnamese books.',
  },
  lessons,
};

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Wrote ${lessons.length} legacy lessons to ${outputPath}`);

