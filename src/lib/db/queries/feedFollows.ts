import { eq, and } from "drizzle-orm";
import { db } from "..";
import { feedFollows, FeedFollow, feeds, users } from "../schema";

export async function createFeedFollow(feedId:string, userId:string){
    const [newFeedFollow] = await db.insert(feedFollows).values({
        feed_id: feedId,
        user_id: userId
    }).returning()

    const [selectFeedFollow] = await db.select({
        feedFollowId: feedFollows.id,
        feedFollowCreatedAt: feedFollows.createdAt, 
        feedFollowUpdatedAt: feedFollows.updatedAt,
        userName: users.name,
        feedName: feeds.name
        }).from(feedFollows).innerJoin(users, eq(users.id, feedFollows.user_id)).innerJoin(feeds, eq(feeds.id, feedFollows.feed_id)).where(eq(feedFollows.id, newFeedFollow.id))

    
    return selectFeedFollow
}

export async function getFeedFollowsForUser(userId:string) {
    const followedFeedNames = await db.select({feedName: feeds.name}).from(feedFollows).innerJoin(feeds, eq(feedFollows.feed_id, feeds.id)).where(eq(feedFollows.user_id, userId))

    const result = {user: userId, feeds: followedFeedNames}
    return result
}

export async function unfollowFeed(userId:string, feedUrl:string) {
    const [feed] = await db.select({id: feeds.id, name: feeds.name}).from(feeds).where(eq(feeds.url, feedUrl)).limit(1)
    if (!feed){
        throw new Error(`Failed to find feed`)
    }
    const unfollowed = await db.delete(feedFollows).where(and(eq(feedFollows.user_id, userId),eq(feedFollows.feed_id, feed.id))).returning()
    if (!unfollowed) {
        throw new Error(`Error unfollowing ${feed.name}`)
    }
    return feed

}