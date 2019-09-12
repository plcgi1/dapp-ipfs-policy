module.exports = {
  generateEmailFromOauthProfile: (profile) => {
    return `${profile.provider}-${profile.id}@${profile.provider}.io`
  }
}