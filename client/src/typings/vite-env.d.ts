/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_IS_AWS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
