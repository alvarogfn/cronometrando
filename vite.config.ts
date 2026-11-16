import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: "/cronometrando",
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      includeAssets: ["favicon.ico", "pwa-icon.svg", "apple-touch-icon.png"],
      manifest: {
        background_color: "#132238",
        description: "Cronômetros para acompanhar questões e provas.",
        display: "standalone",
        id: "/cronometrando/",
        icons: [
          {
            purpose: "any",
            sizes: "192x192",
            src: "pwa-icon-192.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "pwa-icon-512.png",
            type: "image/png",
          },
          {
            sizes: "any",
            src: "pwa-icon.svg",
            type: "image/svg+xml",
          },
        ],
        lang: "pt-BR",
        name: "Cronometrando",
        prefer_related_applications: false,
        scope: "/cronometrando/",
        short_name: "Cronometrando",
        start_url: "/cronometrando/",
        theme_color: "#132238",
      },
      // Wait for the current app session to end before applying an update.
      registerType: "prompt",
    }),
  ],
});
