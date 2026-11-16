import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("GitHub Pages production build", () => {
  it("bundles runtime dependencies instead of fetching them from esm.sh", async () => {
    const assetDirectory = path.join(process.cwd(), "dist", "assets");
    const assetNames = await readdir(assetDirectory);
    const javascriptAssets = assetNames.filter((name) => name.endsWith(".js"));
    const bundles = await Promise.all(
      javascriptAssets.map((name) =>
        readFile(path.join(assetDirectory, name), "utf8"),
      ),
    );
    const assetsWithExternalDependencies = bundles.flatMap((bundle, index) =>
      /https:\/\/esm\.sh\//.test(bundle) ? [javascriptAssets[index]] : [],
    );

    expect(javascriptAssets.length).toBeGreaterThan(0);
    expect(assetsWithExternalDependencies).toEqual([]);
  });
});
