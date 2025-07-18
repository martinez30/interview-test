/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_URL: string
    readonly VITE_APP_SECURE_LOCAL_STORAGE_HASH_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}