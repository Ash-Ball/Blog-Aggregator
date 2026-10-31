import { db } from "..";
import { Feed, feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq, sql } from "drizzle-orm";
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

export async function lookupFeedByUrl(url:string): Promise<Feed> {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url)).limit(1)
  return feed
}

export async function markFeedFetched(feedId:string) {
  const [feed] = await db.update(feeds).set({updatedAt: new Date(), lastFetchedAt: new Date()}).where(eq(feeds.id, feedId)).returning()
}

export async function getNextFeedToFetch(): Promise<Feed>{
  const [feed] = await db.execute(sql`select * from ${feeds} order by last_fetched_at asc nulls first limit 1`) as unknown as Feed[]
  return feed
}
