/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_TITLE: string
    readonly VITE_PROXY_TARGET: string
    readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
