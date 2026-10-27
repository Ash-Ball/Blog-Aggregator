import { readConfig } from "../config";
import { createFeedFollow } from "../lib/db/queries/feedFollows";
import { createFeed, getFeeds, lookupFeedAuthor } from "../lib/db/queries/feeds";
import { getUser, getUserById } from "../lib/db/queries/users";
import { Feed, User } from "../lib/db/schema";

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const config = readConfig();
  console.log(`User read as ${config.currentUserName}`)
  const user = await getUser(config.currentUserName);
  console.log((`User looked up as ${user?.name}`))

  if (!user) {
    throw new Error(`User ${config.currentUserName} not found`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  console.log("Feed created successfully:");
  printFeed(feed, user);

  const follow = await createFeedFollow(feed.id, user.id)
  console.log(`Feed Followed:`)
  console.log(`${follow.feedName} followed by ${follow.userName}`)
  
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerFeeds(_:string) {
  const feeds = await getFeeds()
  if (!feeds || feeds.length === 0) {
    throw new Error('Failed to get all feeds')
  }

  for (let feed of feeds){
    let user = await getUserById(feed.userId)
    if (!user) {
      throw new Error(`Failed to find user for feed ${feed.name}`)
    }
    printFeed(feed, user)
    console.log("\n")
  }
}

