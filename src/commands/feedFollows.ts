import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feedFollows";
import { lookupFeedByUrl } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";

export async function handlerFollowFeed(cmdName: string, ...args: string[]){
    if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
    }
    const config = readConfig();
    console.log(`User read as ${config.currentUserName}`)
    const user = await getUser(config.currentUserName);
    
    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedUrl = args[0]
    const feed = await lookupFeedByUrl(feedUrl)
    if (!feed) {
        throw new Error("Feed not found. Use <addFeed> <name> <url>")
    }

    const follow = await createFeedFollow(feed.id, user.id)

    console.log(`Followed feed ${feed.name} for ${user.name}`)
}

export async function handlerFeedsFollowed(cmdName:string, ...args: string[]) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user){
        throw new Error(`User does not exist`)
    }

    const follows = await getFeedFollowsForUser(user.id)
    console.log(`Follows for ${user.name}:`)
    for (let feed of follows.feeds){
        console.log(`> ${feed.feedName}`)
    }

}