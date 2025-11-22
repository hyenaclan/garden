import { FastifyInstance } from "fastify";
import { init } from "../../src/server";
import { setupTestDb } from "./helpers";

let db: Awaited<ReturnType<typeof setupTestDb>>;
let app: FastifyInstance;

describe("Server Integration Tests", () => {
  beforeAll(async () => {
    db = await setupTestDb();

    app = init();
    await app.ready();
  });

  afterAll(async () => {
    await db.teardown();
    await app.close();
  });

  test("GET /public/health returns 200 OK with { ok: true }", async () => {
    const response = await app.inject({ method: "GET", url: "/public/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ ok: true });
  });

  test("GET /public/temp-api/health returns 200 OK", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/public/temp-api/health",
    });
    expect(response.statusCode).toBe(200);
  });

  test("/public/temp-api/health has valid structure and data", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/temp-api/health",
    });
    const body = response.json();
    expect(body).toHaveProperty("message", "Hello from the Garden API");
    expect(body).toHaveProperty("status", "ok");
    expect(typeof body.timestamp).toBe("string");
    const date = new Date(body.timestamp);
    expect(date.toISOString()).toBe(body.timestamp);
  });

  test("/public/temp-api/health includes CORS headers", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/public/temp-api/health",
      headers: { origin: "http://localhost:5173" },
    });
    expect(response.headers).toHaveProperty("access-control-allow-origin");
  });

  test("GET /nonexistent returns 404", async () => {
    const response = await app.inject({ method: "GET", url: "/nonexistent" });
    expect(response.statusCode).toBe(404);
  });

  test("OPTIONS /public/temp-api/health handles CORS preflight", async () => {
    const response = await app.inject({
      method: "OPTIONS",
      url: "/public/temp-api/health",
      headers: {
        origin: "http://localhost:5173",
        "access-control-request-method": "GET",
      },
    });
    expect(response.statusCode).toBe(204);
    expect(response.headers).toHaveProperty("access-control-allow-origin");
    expect(response.headers).toHaveProperty("access-control-allow-methods");
  });
});
