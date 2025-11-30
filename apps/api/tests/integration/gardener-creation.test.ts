import Fastify, { FastifyInstance } from "fastify";
import { init } from "../../src/server";
import { setupTestDb } from "./helpers";
import { getDb } from "../../src/db";
import { gardeners } from "../../src/schema";
import { eq, sql } from "drizzle-orm";

let db: Awaited<ReturnType<typeof setupTestDb>>;
let app: FastifyInstance;

describe("Gardener Creation Tests", () => {
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

  test("creates gardener on first profile access and reuses on second", async () => {
    const testDb = getDb();

    // Verify no gardener in db initially
    const initialCount = await testDb
      .select({ count: sql<number>`count(*)` })
      .from(gardeners);
    expect(Number(initialCount[0].count)).toBe(0);

    // Create a valid JWT token for testing (hardcoded for simplicity)
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LWV4dGVybmFsLWlkIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.abc";

    // First call to /api/user/profile
    const firstResponse = await app.inject({
      method: "GET",
      url: "/api/user/profile",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(firstResponse.statusCode).toBe(200);
    const firstProfile = firstResponse.json();
    expect(firstProfile).toHaveProperty("id");
    expect(firstProfile.email).toBe("test@example.com");
    expect(firstProfile.externalId).toBe("test-external-id");

    // Verify gardener was created in db
    const afterFirstCall = await testDb
      .select({ count: sql<number>`count(*)` })
      .from(gardeners);
    expect(Number(afterFirstCall[0].count)).toBe(1);

    const createdGardener = await testDb
      .select()
      .from(gardeners)
      .where(eq(gardeners.email, "test@example.com"))
      .limit(1);
    expect(createdGardener.length).toBe(1);
    expect(createdGardener[0].id).toBe(firstProfile.id);

    // Second call to /api/user/profile with same token
    const secondResponse = await app.inject({
      method: "GET",
      url: "/api/user/profile",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(secondResponse.statusCode).toBe(200);
    const secondProfile = secondResponse.json();
    expect(secondProfile.id).toBe(firstProfile.id); // Should be the same gardener
    expect(secondProfile.email).toBe(firstProfile.email);
    expect(secondProfile.externalId).toBe(firstProfile.externalId);
    // Verify lastLogin was updated
    expect(new Date(secondProfile.lastLogin).getTime()).toBeGreaterThanOrEqual(
      new Date(firstProfile.lastLogin).getTime(),
    );

    // Verify still only one gardener in db
    const afterSecondCall = await testDb
      .select({ count: sql<number>`count(*)` })
      .from(gardeners);
    expect(Number(afterSecondCall[0].count)).toBe(1);
  });
});
