export function parseDuration(durationStr:string){
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(`Couldn't parse duration arguments. Should be 1s, 10s, 1m, 1h, etc`)
  }
  if (match.length !== 3) {
    return
  }

  const value = parseInt(match[1], 10)
  const unit = match[2]
  console.log(`unit slice = ${unit}`)
  console.log(`time slice = ${value}`)

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
    }
}