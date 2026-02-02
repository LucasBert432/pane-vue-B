declare module "@vitejs/plugin-vue" {
  import { Plugin } from "vite";

  interface VuePluginOptions {
    include?: string | RegExp | (string | RegExp)[];
    exclude?: string | RegExp | (string | RegExp)[];
    isProduction?: boolean;
    script?: any;
    template?: any;
    style?: any;
    reactivityTransform?: boolean;
  }

  export default function vue(options?: VuePluginOptions): Plugin;
}
