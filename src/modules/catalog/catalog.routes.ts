import { Router } from "express";

export function catalogRouter(): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({ items: [] });
  });

  return router;
}