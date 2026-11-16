import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const outputDirectory = path.join(process.cwd(), "dist");

describe("PWA production build", () => {
  it("generates an installable manifest scoped to the GitHub Pages app", async () => {
    const manifest = JSON.parse(
      await readFile(
        path.join(outputDirectory, "manifest.webmanifest"),
        "utf8",
      ),
    ) as {
      display: string;
      icons: Array<{ sizes: string; src: string; type: string }>;
      name: string;
      scope: string;
      start_url: string;
    };

    expect(manifest.name).toBe("Cronometrando");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/cronometrando/");
    expect(manifest.scope).toBe("/cronometrando/");
    expect(manifest.icons.map((icon) => icon.sizes)).toContain("192x192");
    expect(manifest.icons.map((icon) => icon.sizes)).toContain("512x512");

    for (const icon of manifest.icons.filter((entry) =>
      entry.type.startsWith("image/png"),
    )) {
      const iconPath = path.join(outputDirectory, path.basename(icon.src));
      const iconFile = await readFile(iconPath);
      const declaredSize = Number(icon.sizes.split("x")[0]);

      expect(iconFile.subarray(1, 4).toString()).toBe("PNG");
      expect(iconFile.readUInt32BE(16)).toBe(declaredSize);
      expect(iconFile.readUInt32BE(20)).toBe(declaredSize);
      expect(icon.type).toBe("image/png");
    }
  });

  it("outputs a service worker and links the manifest from the built page", async () => {
    const [files, html, serviceWorker] = await Promise.all([
      readdir(outputDirectory),
      readFile(path.join(outputDirectory, "index.html"), "utf8"),
      readFile(path.join(outputDirectory, "sw.js"), "utf8"),
    ]);

    expect(files).toContain("sw.js");
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('href="/cronometrando/pwa-icon.svg"');
    expect(html).toContain('href="/cronometrando/apple-touch-icon.png"');
    expect(serviceWorker).toContain("precacheAndRoute");
  });
});
