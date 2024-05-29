/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_TITLE: string
    readonly VITE_PROXY_TARGET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
