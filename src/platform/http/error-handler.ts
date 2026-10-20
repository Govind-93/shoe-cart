import type {} from "pino-http";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "./errors";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    code: "not_found",
    message: `Route ${req.method} ${req.path} not found`,
    request_id: String(req.id),
  });
};

export const errorHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      request_id: String(req.id),
    });
    return;
  }
  req.log.error({ err }, "unhandled error");
  res.status(500).json({
    code: "internal_error",
    message: "Something went wrong",
    request_id: String(req.id),
  });
};