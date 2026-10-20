import pino from "pino";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";

const app = createApp(pino({ level: "silent" }));

describe("app", () => {
  it("GET /healthz returns ok and a request id", async () => {
    const res = await request(app).get("/healthz");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
    expect(res.headers["x-request-id"]).toBeTruthy();
  });

  it("returns the standard error shape for unknown routes", async () => {
    const res = await request(app).get("/nope");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ code: "not_found" });
  });
});