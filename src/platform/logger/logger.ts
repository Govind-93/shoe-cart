import pino, { type Logger } from "pino";
import type { Env } from "../config/env";

export function createLogger(env: Pick<Env, "NODE_ENV" | "LOG_LEVEL">): Logger {
  return pino({
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === "development"
      ? { transport: { target: "pino-pretty" } }
      : {}),
  });
}