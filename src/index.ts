import {setUser, readConfig} from "src/config"
import { argv, exit } from "node:process";
import { createUser, getUser, getUsers, resetUsers } from "./lib/db/queries/users";
import { fetchFeed, printFeed } from "./helpers";
import { insertFeed, resetFeeds } from "./lib/db/queries/feeds";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type CommandRegisty = {
  [cmdName: string]: CommandHandler
};

const userAgent = "gator"


function registerCommand(registry: CommandRegisty, cmdName: string, handler: CommandHandler): void {
  registry[cmdName] = handler

}

async function runCommand(registry: CommandRegisty, cmdName: string, ...args: string[]): Promise<void> {
  if (cmdName in registry){
    console.log(`Running command ${cmdName}`)
    await registry[cmdName](cmdName, ...args)

  }else {
    throw Error('Command not found')
  }
}




async function handlerLogin(cmdName: string, ...args: string[]): Promise<void>{
    if (args.length === 0) {
        throw Error('Username required to login')
    }
    if ((await getUser(args[0])) == undefined){
      throw Error("Login failed. User doesn't exist")
    }
    setUser(args[0])
    console.log('User has been set')


}

async function registerUser(cmdName: string, ...args: string[]): Promise<void>{
  const existingUser = await getUser(args[0]);
  if (args.length < 1){
    throw Error('No arguments provided to register a user')
  } else if (existingUser !== undefined) {
    throw new Error('User already exists')
  }
  const usr = await createUser(args[0]);
  setUser(args[0]);
  console.log('User created:')
  console.log(JSON.stringify(usr))
}

async function resetDb(cmdName:string, ...args:string[]): Promise<void>{
  await resetUsers()
  await resetFeeds()
}

async function users(cmdName:string, ...args:string[]): Promise<void>{
  const users = await getUsers()
  for (let i = 0; i < users.length; i++){
    let user = users[i]
    if (user.name === readConfig().currentUserName){
      console.log(`${user.name} (current)`)
    } else {
      console.log(`${user.name}`)
    }
  }
}


async function agg(cmdName:string, ...args:string[]): Promise<void>{
  const feedURL = args[0]
  console.log(JSON.stringify(await fetchFeed(feedURL)))
}

async function addFeed(cmdName:string, ...args:string[]): Promise<void> {
  if (args.length !== 2) {
    throw new Error("Missing arguments for adding feed. Expected 2.")
  }
  const user = await getUser(readConfig().currentUserName)
  const feed = await insertFeed(user.id, args[0], args[1])
  printFeed(feed, user)
  

}




async function main() {
  const cmdRegisty = {} as CommandRegisty
  registerCommand(cmdRegisty, "login", handlerLogin)
  registerCommand(cmdRegisty, "register", registerUser)
  registerCommand(cmdRegisty, "reset", resetDb)
  registerCommand(cmdRegisty, "users", users)
  registerCommand(cmdRegisty, "agg", agg)
  registerCommand(cmdRegisty, "addfeed", addFeed)

  const args = argv.slice(3)
  const cmd = argv.slice(2)[0]
  
  if (cmd.length < 1) {
    console.log('No arguments provided')
    exit(1)
  }

  try{
  await runCommand(cmdRegisty, cmd, ...args)
  } catch (error) {
    if (error instanceof Error) {
    console.error(error.message)
    process.exit(1)
  } else {
    console.error("Unknown error:", error)
  }
  }

  process.exit(0)
}

main();