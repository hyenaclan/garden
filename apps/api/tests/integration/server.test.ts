import Fastify, { FastifyInstance } from "fastify";
import { init } from "../../src/server.js";
import { setupTestDb } from "./helpers.js";

let db: Awaited<ReturnType<typeof setupTestDb>>;
let app: FastifyInstance;

describe("Server Integration Tests", () => {
  beforeAll(async () => {
    db = await setupTestDb();

    app = Fastify({ logger: true });
    init(app);
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

  test("GET /nonexistent returns 404", async () => {
    const response = await app.inject({ method: "GET", url: "/nonexistent" });
    expect(response.statusCode).toBe(404);
  });
});
