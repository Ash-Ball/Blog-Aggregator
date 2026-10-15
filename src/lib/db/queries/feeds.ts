import { db } from "..";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq } from "drizzle-orm";
import { User } from "../schema";


export async function createFeed(
  feedName: string,
  url: string,
  userId: string,
) {
  const result = await db
    .insert(feeds)
    .values({
      name: feedName,
      url,
      userId,
    })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  return db.select().from(feeds);
}

export async function lookupFeedAuthor(feedId: string): Promise<User> {
  const [result] = await db.select({users}).from(users).innerJoin(feeds, eq(users.id, feeds.userId)).where(eq(feeds.id, feedId))
  return result.users
}
