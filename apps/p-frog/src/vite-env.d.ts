/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST: string
  readonly VITE_SERVER_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
