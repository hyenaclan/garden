import Fastify, { FastifyInstance } from "fastify";
import { init } from "../../src/server.js";
import { setupTestDb } from "./helpers.js";
import { getDb } from "../../src/db.js";
import { gardeners } from "../../src/schema.js";
import { eq, sql } from "drizzle-orm";

let db: Awaited<ReturnType<typeof setupTestDb>>;
let app: FastifyInstance;

describe("Garden endpoint access", () => {
  beforeAll(async () => {
    process.env.IS_LOCAL = "true"; // Enable local JWT decoding for tests
    db = await setupTestDb();

    app = Fastify({ logger: true });
    init(app);
    await app.ready();
  });

  beforeEach(async () => {
    // Clean up gardeners table before each test
    const testDb = getDb();
    await testDb.delete(gardeners);
  });

  afterAll(async () => {
    await db.teardown();
    await app.close();
  });

  test("returns garden data on repeated access", async () => {
    const testDb = getDb();

    // Verify no gardener in db initially
    const initialCount = await testDb
      .select({ count: sql<number>`count(*)` })
      .from(gardeners);
    expect(Number(initialCount[0].count)).toBe(0);

    // Create a valid JWT token for testing (hardcoded for simplicity)
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWV4dGVybmFsLWlkIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.abc";

    // First call to /gardens/:id
    const firstResponse = await app.inject({
      method: "GET",
      url: "/gardens/demo-garden",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(firstResponse.statusCode).toBe(200);
    const firstBody = firstResponse.json();
    expect(firstBody).toHaveProperty("garden");
    expect(firstBody.garden.id).toBe("demo-garden");
    expect(firstBody.garden.name).toBe("My Garden");

    // Second call to /gardens/:id should return the same sample data
    const secondResponse = await app.inject({
      method: "GET",
      url: "/gardens/demo-garden",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(secondResponse.statusCode).toBe(200);
    const secondBody = secondResponse.json();
    expect(secondBody.garden.id).toBe(firstBody.garden.id);
    expect(secondBody.garden.name).toBe(firstBody.garden.name);

    // Gardener creation is not expected on this endpoint
    const afterSecondCall = await testDb
      .select({ count: sql<number>`count(*)` })
      .from(gardeners);
    expect(Number(afterSecondCall[0].count)).toBe(0);
  });
});
