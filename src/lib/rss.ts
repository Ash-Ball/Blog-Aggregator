import { XMLParser } from "fast-xml-parser";
import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { truncateSync } from "fs";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  const res = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
      accept: "application/rss+xml",
    },
  });
  if (!res.ok) {
    throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const parser = new XMLParser();
  let result = parser.parse(xml);

  const channel = result.rss?.channel;
  if (!channel) {
    throw new Error("failed to parse channel");
  }

  if (
    !channel ||
    !channel.title ||
    !channel.link ||
    !channel.description ||
    !channel.item
  ) {
    throw new Error("failed to parse channel");
  }

  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];

  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  const rss: RSSFeed = {
    channel: {
      title: channel.title,
      link: channel.link,
      description: channel.description,
      item: rssItems,
    },
  };

  return rss;
}


export async function scrapeFeeds(){
  const feedToFetch = await getNextFeedToFetch()
  if (!feedToFetch){
    throw new Error('Failed to lookup next feed to fetch from the db')
  }

  console.log(`Fetching feed ${feedToFetch.name} from ${feedToFetch.url}`)


  const rssFeed = await fetchFeed(feedToFetch.url)
  if (!rssFeed){
    throw new Error(`Failed to fetch RSS Feed`)
  }
  markFeedFetched(feedToFetch.id)

  if (rssFeed.channel.item.length > 0) {
    console.log(`Fetched:`)
    for (let item of rssFeed.channel.item){
      console.log(`> ${item.title}`)
    }
  } else {
    console.log(`Fetched RSS feed ${rssFeed.channel.title} but it contains no items.`)
  }
}
