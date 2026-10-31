import { getPostsUser } from "../lib/db/queries/posts";
import { User, users } from "../lib/db/schema";


export async function handlerBrowse(cmdName: string, user: User, ...args: string[]){
    if (args.length > 1) {
        throw new Error(`usage: ${cmdName} <optional return limit - eg 3>`)
    }

    const parsedLimit = Number(args[0])
    const returnLimit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? parsedLimit : 2;

    const usersPosts = await getPostsUser(user.id, returnLimit)
    if (usersPosts.length === 0) {
        console.log(`${user.name} has no posts to browse`)
        return
    }

    console.log(`---------- Post digest for ${user.name} ----------\n`)
    for (let post of usersPosts){
        console.log(`> ${post.posts.title}:`)
        console.log(`${post.posts.description} \n`)
    }
}