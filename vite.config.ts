import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { dependencies } from "./package.json";

// eslint-disable-next-line unicorn/no-array-reduce
const paths = Object.entries(dependencies).reduce<Record<string, string>>(
  (acc, [name, version]) => {
    acc[name] = `https://esm.sh/${name}@${version}`;
    return acc;
  },
  {},
);

// https://vite.dev/config/
export default defineConfig({
  base: "/cronometrando",
  build: {
    rollupOptions: {
      external: Object.keys(dependencies),
      output: {
        paths,
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
