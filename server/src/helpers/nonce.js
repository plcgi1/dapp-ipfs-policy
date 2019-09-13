module.exports = {
  genNonce: () => {
    return Math.floor(Math.random() * 10000)
  }
}
