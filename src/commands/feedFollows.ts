import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser, unfollowFeed } from "../lib/db/queries/feedFollows";
import { lookupFeedByUrl } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
import { User } from "../lib/db/schema";

export async function handlerFollowFeed(cmdName: string, user: User, ...args: string[]){
    if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
    }
    const feedUrl = args[0]
    const feed = await lookupFeedByUrl(feedUrl)
    if (!feed) {
        throw new Error("Feed not found. Use <addFeed> <name> <url>")
    }

    const follow = await createFeedFollow(feed.id, user.id)

    console.log(`Followed feed ${feed.name} for ${user.name}`)
}

export async function handlerFeedsFollowed(cmdName:string, user: User, ...args: string[]) {
    const follows = await getFeedFollowsForUser(user.id)
    console.log(`Follows for ${user.name}:`)
    for (let feed of follows.feeds){
        console.log(`> ${feed.feedName}`)
    }

}

export async function handlerUnfollowFeed(cmdName:string, user:User, ...args:string[]){
     if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
    }
    const unfollowed = await unfollowFeed(user.id, args[0])
    console.log(`Unfollowed ${unfollowed.name}`)
}