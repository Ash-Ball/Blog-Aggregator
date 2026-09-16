import {setUser, readConfig} from "src/config"

function main() {
  setUser("ash", readConfig())
  const config = readConfig()
  console.log("> Current config:")
  console.log(`${JSON.stringify(config)}`)
  

}

main();