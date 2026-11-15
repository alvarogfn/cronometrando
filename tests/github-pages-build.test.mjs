import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

test("GitHub Pages build does not depend on esm.sh at runtime", async () => {
  const assetDirectory = join(process.cwd(), "dist", "assets");
  const assetNames = await readdir(assetDirectory);
  const javascriptAssets = assetNames.filter((name) => name.endsWith(".js"));
  const bundles = await Promise.all(
    javascriptAssets.map((name) =>
      readFile(join(assetDirectory, name), "utf8"),
    ),
  );
  const assetsWithExternalDependencies = bundles.flatMap((bundle, index) =>
    /https:\/\/esm\.sh\//.test(bundle) ? [javascriptAssets[index]] : [],
  );

  assert.ok(javascriptAssets.length > 0, "the build should contain JS assets");
  assert.deepEqual(
    assetsWithExternalDependencies,
    [],
    "runtime dependencies should be bundled instead of fetched from esm.sh",
  );
});
