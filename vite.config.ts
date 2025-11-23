import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          fluentui: ["@fluentui/react-components", "@fluentui/react-icons"],
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
