import { db } from "..";
import { users } from "../schema";
import { eq, lt, gte, ne} from 'drizzle-orm';

export type User = typeof users.$inferSelect;

export async function createUser(name: string) {

    try{
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
    } catch {
        throw Error('database error')
    }
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name))
    return result
}

export async function resetUsers(){
    const [result] = await db.delete(users)
    return result
}

export async function getUsers(){
    return await db.select().from(users)
    
}

