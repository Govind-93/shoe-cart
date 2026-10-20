import http from "node:http";
import { createApp } from "./app";
import { loadEnv } from "./platform/config/env";
import { createLogger } from "./platform/logger/logger";

function main(): void {
  const env = loadEnv();
  const logger = createLogger(env);
  const server = http.createServer(createApp(logger));

  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "http server listening");
  });

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "shutdown signal received");

    // Safety net: if connections never drain, exit anyway.
    setTimeout(() => {
      logger.error("forced shutdown after timeout");
      process.exit(1);
    }, env.SHUTDOWN_TIMEOUT_MS).unref();

    server.close((err) => {
      if (err) {
        logger.error({ err }, "error during shutdown");
        process.exit(1);
      }
      logger.info("server stopped cleanly");
      process.exit(0);
    });
    server.closeIdleConnections();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (reason) => {
    logger.fatal({ err: reason }, "unhandled rejection");
    process.exit(1);
  });
  process.on("uncaughtException", (err) => {
    logger.fatal({ err }, "uncaught exception");
    process.exit(1);
  });
}

main();