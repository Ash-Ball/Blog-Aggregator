import { db } from "..";
import { feeds } from "../schema";
import { eq, lt, gte, ne} from 'drizzle-orm';

export type Feed = typeof feeds.$inferSelect;

export async function insertFeed(userId:string, name:string, url: string): Promise<Feed> {
    try{
        const [result] = await db.insert(feeds).values({user_id: userId, name: name, url: url}).returning()
        return result
    } catch {
        throw Error('Error inserting new feed into db.')
    }
}

export async function resetFeeds(){
    const [result] = await db.delete(feeds)
    return result
}