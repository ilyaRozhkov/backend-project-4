const replaceSymbols = (str) => {
  let strToChange = str
  const reg = /[^a-zа-яёA-ZА-ЯЁ\d]/g
  if (str.endsWith('/')) strToChange = str.slice(0, str.length - 1)
  return strToChange.replaceAll(reg, '-')
}

const changeName = (str, endType) => `${replaceSymbols(str)}${endType}`

export default changeName
