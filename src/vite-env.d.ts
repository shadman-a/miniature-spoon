/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN: string
  readonly VITE_DB_OWNER: string
  readonly VITE_DB_REPO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
