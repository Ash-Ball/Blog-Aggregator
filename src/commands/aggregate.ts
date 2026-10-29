import { errorHandler } from "../errorHandling";
import { scrapeFeeds } from "../lib/rss";
import { parseDuration } from "../lib/time";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const refreshTime = args[0]
  if (args.length !== 1) {
    throw new Error(`Usage for ${cmdName}: <time between requests> {EG: 1s, 1m, 1h}`)
  }
  const timeBetweenRequests = parseDuration(refreshTime)
  scrapeFeeds()
  const interval = setInterval(() => {
  scrapeFeeds().catch(errorHandler);
}, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
   
}


