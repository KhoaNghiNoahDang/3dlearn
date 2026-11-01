/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASSET_BASE_URL?: string;
  readonly VITE_LEGACY_BASE_URL?: string;
  readonly VITE_TEXTBOOK_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
