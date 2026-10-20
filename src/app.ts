import { randomUUID } from "node:crypto";
import express, { type Express } from "express";
import { pinoHttp } from "pino-http";
import type { Logger } from "pino";
import { errorHandler, notFound } from "./platform/http/error-handler";
// import { catalogRouter } from "./modules/catalog";

export function createApp(logger: Logger): Express {
  const app = express();
  app.disable("x-powered-by");

  app.use(
    pinoHttp({
      logger,
      genReqId: (req, res) => {
        const incoming = req.headers["x-request-id"];
        const id = typeof incoming === "string" && incoming !== "" ? incoming : randomUUID();
        res.setHeader("X-Request-Id", id);
        return id;
      },
    }),
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });

//   app.use("/v1/products", catalogRouter());

  app.use(notFound);
  app.use(errorHandler);

  return app;
}