import { getDb } from "../db";
import { gardeners } from "../schema";

export interface IUserParams {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Fetches the user profile by email, updating the lastLogin timestamp.
 * If the user doesn't exist, creates a new user with the provided details.
 * Uses an upsert operation to minimize database calls.
 * @param userParams - The user parameters
 * @returns The user object from the database
 */
export const upsertAndGetUser = async (userParams: IUserParams) => {
  const db = getDb();
  // Ensure name is not null or empty
  const name = userParams.name || userParams.email;
  const result = await db
    .insert(gardeners)
    .values({
      id: userParams.id,
      email: userParams.email,
      name,
      lastLogin: new Date(),
    })
    .onConflictDoUpdate({
      target: gardeners.email,
      set: {
        lastLogin: new Date(),
      },
    })
    .returning();
  return result[0];
};
