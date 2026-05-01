import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@src": r("./src"),
      "@core": r("./src/app/core"),
      "@application": r("./src/app/core/application"),
      "@domain": r("./src/app/core/domain"),
      "@errors": r("./src/app/core/errors"),
    },
  },
});
