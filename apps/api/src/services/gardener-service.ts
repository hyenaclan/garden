import { getDb } from "../db";
import { gardeners } from "../schema";

export interface IUserParams {
  email: string;
  externalId: string;
  externalProvider: string;
}

export enum ExternalProvider {
  COGNITO = "cognito",
}

/**
 * Upserts a gardener record based on externalId, updating lastLogin on each call.
 * If the user doesn't exist, creates a new user with the provided details.
 * Uses an upsert operation to minimize database calls.
 * @param userParams - The user parameters including email, externalId, and externalProvider
 * @returns The user object from the database
 */
export const upsertAndGetGardener = async (
  userParams: IUserParams,
): Promise<typeof gardeners.$inferSelect> => {
  const db = getDb();
  const utcNow = new Date();
  const result = await db
    .insert(gardeners)
    .values({
      email: userParams.email,
      externalId: userParams.externalId,
      externalProvider: userParams.externalProvider,
      lastLogin: utcNow,
    })
    .onConflictDoUpdate({
      target: gardeners.externalId,
      set: {
        lastLogin: utcNow,
      },
    })
    .returning();

  if (!result[0]) {
    throw new Error("Upsert failed: no record returned");
  }

  return result[0];
};
