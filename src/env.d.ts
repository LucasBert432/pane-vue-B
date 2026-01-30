/// <reference types="vite/client" />

declare module "@vitejs/plugin-vue" {
  import { Plugin } from "vite";
  const plugin: Plugin;
  export default plugin;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
