import { eq, desc } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, Post, posts } from "../schema";

export async function createPost(title:string, url:string, description: string, publishedAt: Date, feedId:string){
    const [post] = await db.insert(posts).values({
        title, url, description, feedId, publishedAt
    }).returning()

    return post
}

export async function getPostsUser(userId: string, limit:number) {
    const usersPosts = await db.select({posts: posts}).from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feed_id))
    .where(eq(feedFollows.user_id, userId)).orderBy(desc(posts.publishedAt)).limit(limit)
    return usersPosts
}