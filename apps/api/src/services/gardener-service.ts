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
 * Fetches the user profile by email, updating the lastLogin timestamp.
 * If the user doesn't exist, creates a new user with the provided details.
 * Uses an upsert operation to minimize database calls.
 * @param userParams - The user parameters
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
      target: gardeners.email,
      set: {
        lastLogin: utcNow,
      },
    })
    .returning();

  return result[0];
};
