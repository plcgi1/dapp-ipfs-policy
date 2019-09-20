export default function (string, div = '...') {
  return `${string.substr(0,4)}${div}${string.substr(string.length-4, string.length)}`
}