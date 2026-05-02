import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SPEC_PATH = resolve(process.cwd(), "docs/openapi.yaml");

export function DocsController() {
  const spec = parse(readFileSync(SPEC_PATH, "utf-8")) as Record<string, unknown>;

  const router = Router();
  router.use("/docs", swaggerUi.serve);
  router.get("/docs", swaggerUi.setup(spec, { customSiteTitle: "auth-system API" }));
  router.get("/docs/openapi.json", (_req, res) => {
    res.json(spec);
  });
  return router;
}
