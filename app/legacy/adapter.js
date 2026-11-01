/**
 * Compatibility adapter for the existing self-contained lessons in /courses.
 *
 * The adapter is deliberately independent from the future UI shell. A shell
 * can use it in either of these ways:
 *
 *   const manifest = await loadLegacyManifest();
 *   const iframe = createLegacyIframe('capacitor-step', { manifest });
 *   container.replaceChildren(iframe);
 *
 *   const route = getLegacyRoute('capacitor-step', { manifest });
 *   // route === '/legacy/capacitor-step'
 *
 * Never concatenate an untrusted slug directly into a URL. All launch helpers
 * resolve the slug through the allowlisted manifest first.
 */

const DEFAULT_MANIFEST_URL = new URL('./manifest.json', import.meta.url);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getLegacyBaseUrl() {
  const configured = String(import.meta.env?.VITE_LEGACY_BASE_URL || '').trim();
  // Resolve relative legacy paths from the site origin, not document.baseURI.
  // The React app is mounted at /app/, while legacy files live at /courses/.
  return configured || globalThis.location?.origin || '/';
}

function joinBaseAndPath(baseUrl, path) {
  const cleanPath = String(path || '').replace(/^\/+/, '');
  if (!baseUrl || baseUrl === '/') return `/${cleanPath}`;
  return `${String(baseUrl).replace(/\/+$/, '')}/${cleanPath}`;
}

function assertManifest(manifest) {
  if (!manifest || !Array.isArray(manifest.lessons)) {
    throw new TypeError('Invalid legacy manifest: lessons[] is required.');
  }
  return manifest;
}

function normalizeSlug(slug) {
  if (typeof slug !== 'string') return '';
  return slug.trim().toLowerCase();
}

function findLegacyLesson(slug, manifest) {
  const safeSlug = normalizeSlug(slug);
  if (!SLUG_PATTERN.test(safeSlug)) return null;
  return assertManifest(manifest).lessons.find((lesson) => lesson.slug === safeSlug) || null;
}

export async function loadLegacyManifest(url = DEFAULT_MANIFEST_URL) {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Unable to load legacy manifest (${response.status}).`);
  }
  return assertManifest(await response.json());
}

export function getLegacyLesson(slug, { manifest } = {}) {
  return findLegacyLesson(slug, manifest);
}

export function requireLegacyLesson(slug, { manifest } = {}) {
  const lesson = findLegacyLesson(slug, manifest);
  if (!lesson) throw new Error(`Unknown legacy lesson slug: ${String(slug)}`);
  return lesson;
}

export function getLegacyUrl(
  slug,
  { manifest, baseUrl = getLegacyBaseUrl() } = {},
) {
  const lesson = requireLegacyLesson(slug, { manifest });
  const path = lesson.launch?.path || lesson.path;
  if (!path) throw new Error(`Legacy lesson has no launch path: ${lesson.slug}`);
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  return joinBaseAndPath(baseUrl, path);
}

export function getLegacyRoute(slug, { manifest, prefix = '/legacy' } = {}) {
  const lesson = requireLegacyLesson(slug, { manifest });
  const safePrefix = `/${String(prefix).replace(/^\/+|\/+$/g, '')}`;
  return `${safePrefix}/${encodeURIComponent(lesson.slug)}`;
}

export function createLegacyIframe(slug, {
  manifest,
  baseUrl = getLegacyBaseUrl(),
  title,
  className = 'legacy-lesson-frame',
  loading = 'lazy',
  sandbox = 'allow-scripts allow-forms allow-modals allow-pointer-lock allow-presentation',
} = {}) {
  const lesson = requireLegacyLesson(slug, { manifest });
  const iframe = document.createElement('iframe');
  iframe.className = className;
  iframe.src = getLegacyUrl(lesson.slug, { manifest, baseUrl });
  iframe.title = title || lesson.title;
  iframe.loading = loading;
  iframe.allow = 'fullscreen; autoplay';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('sandbox', sandbox);
  iframe.dataset.legacySlug = lesson.slug;
  return iframe;
}

export function listLegacyLessons({ manifest, subject, status } = {}) {
  const lessons = assertManifest(manifest).lessons;
  return lessons.filter((lesson) => {
    if (subject && lesson.subject !== subject) return false;
    if (status && lesson.curriculum.status !== status) return false;
    return true;
  });
}

export function resolveLegacyPath(pathname, { manifest, prefix = '/legacy' } = {}) {
  const safePrefix = `/${String(prefix).replace(/^\/+|\/+$/g, '')}`;
  const path = String(pathname || '').replace(/\/+$/, '') || '/';
  if (!path.startsWith(`${safePrefix}/`)) return null;
  let slug;
  try {
    slug = decodeURIComponent(path.slice(safePrefix.length + 1));
  } catch {
    return null;
  }
  return findLegacyLesson(slug, manifest);
}

