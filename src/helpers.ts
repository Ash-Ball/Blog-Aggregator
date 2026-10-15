//Any functions that index.ts calls but isn't directly callable by the user 

import { Feed } from "./lib/db/queries/feeds";
import { User } from "./lib/db/queries/users";
import { RSSFeed, RSSItem } from "./types"
import { XMLParser } from "fast-xml-parser";

export async function fetchFeed(feedURL:string): Promise<RSSFeed>{
 if (!feedURL){
    feedURL = "https://www.wagslane.dev/index.xml"
 }
  const res = await fetch(feedURL,{headers: {'user-agent': 'gator'}})
  if (!res.ok){
    throw new Error(`Fetch Failed" ${res.status} ${res.statusText}`)
  }
  const data = await res.text()
  const options = { htmlEntities:true }
  const parser = new XMLParser(options)
  let jsonObj: RSSFeed = parser.parse(data).rss


  const channel = jsonObj?.channel
  if (!channel){
    throw new Error(`Couldn't parse RSS to get a channel`)
  }

  const title = channel.title
  if (typeof title !== 'string') {
    throw new Error(`RSS channel has no title`)
  }

  const link = channel.link
  if (typeof link !== 'string') {
    throw new Error(`RSS channel has no link`)
  }

  const description = channel.description
  if (typeof description !== 'string') {
    throw new Error(`RSS channel has no description`)
  }
  let items:RSSItem[] = []
  if ('item' in channel){
    if (Array.isArray(channel.item)){
      items = channel.item
    } else {
      items = [channel.item]
    }
  }

  let parsedItems:RSSItem[] = []
  for (let i=0; i < items.length; i++){
    const itemTitle = items[i].title
    const itemLink = items[i].link
    const itemDescription = items[i].description
    const itemPubDate = items[i].pubDate

    if (!itemTitle || !itemLink || !itemDescription || !itemPubDate){
      continue
    }
    const item: RSSItem = {
      title: itemTitle,
      link: itemLink,
      description: itemDescription,
      pubDate: itemPubDate
    }
    parsedItems.push(item)
  }

  let output: RSSFeed = {
    channel: {
      title: title,
      link: link,
      description: description,
      item: parsedItems
    }
  }

  return output
}

export async function printFeed(feed:Feed, user:User): Promise<void> {
  console.log(JSON.stringify(user))
  console.log(JSON.stringify(feed))
}