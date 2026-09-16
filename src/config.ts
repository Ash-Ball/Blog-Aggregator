import fs from "fs";
import os from "os";
import path from "path";

type Config = {
    dbUrl: string
    currentUserName: string
};

function getConfigFilePath(): string{
    const cfgPath = path.join(os.homedir(), "/gatorconfig.json")
    return cfgPath
}

function writeConfig(cgf: Config): void{

    const jsonData = {
        "db_url": cgf.dbUrl,
        "current_user_name": cgf.currentUserName
    }

    const data = JSON.stringify(jsonData)
    console.log(`> Updating config at: ${getConfigFilePath()}`)
    fs.writeFileSync(getConfigFilePath(), data)
}


function validateConfig(rawcfg: any): Config {
    const cfg = {} as Config
    cfg.dbUrl = rawcfg.db_url
    cfg.currentUserName = rawcfg.current_user_name ?? "unknown user"
    return cfg
}

export function setUser(user:string, cfg: Config): void {
    console.log(`> Setting user to  ${user}`)
    cfg.currentUserName = user
    writeConfig(cfg)
}

export function readConfig():Config {
    const cfgData = fs.readFileSync(getConfigFilePath(), {encoding: 'utf-8'})
    const cfg: Config = validateConfig(JSON.parse(cfgData))
    return cfg
}