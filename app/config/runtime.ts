const DEFAULT_BASE_URL = '/';

function configuredBase(value: string | undefined): string {
  return (value ?? DEFAULT_BASE_URL).trim() || DEFAULT_BASE_URL;
}

function isAbsoluteUrl(value: string): boolean {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function joinBaseAndPath(base: string, assetPath: string): string {
  const cleanPath = assetPath.replace(/^\/+/, '');
  if (!base || base === '/') return `/${cleanPath}`;
  return `${base.replace(/\/+$/, '')}/${cleanPath}`;
}

export const runtime = {
  assetBaseUrl: configuredBase(import.meta.env.VITE_ASSET_BASE_URL),
  legacyBaseUrl: configuredBase(import.meta.env.VITE_LEGACY_BASE_URL),
  textbookBaseUrl: configuredBase(import.meta.env.VITE_TEXTBOOK_BASE_URL),
} as const;

export function resolveRuntimeUrl(path: string, baseUrl = runtime.assetBaseUrl): string {
  const value = String(path || '').trim();
  if (!value) return '';
  if (isAbsoluteUrl(value)) return value;
  return joinBaseAndPath(baseUrl, value);
}

export function assetUrl(path: string): string {
  return resolveRuntimeUrl(path, runtime.assetBaseUrl);
}

export function legacyAssetUrl(path: string): string {
  return resolveRuntimeUrl(path, runtime.legacyBaseUrl);
}

export function textbookUrl(path: string): string {
  return resolveRuntimeUrl(path, runtime.textbookBaseUrl);
}
