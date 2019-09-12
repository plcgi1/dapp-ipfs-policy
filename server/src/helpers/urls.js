const config = require('../../config/environment')

module.exports = {
  resetPasswordUrl: (user) => {
    return `${config.serverUrl}/api/auth/reset-password/confirm?hash=${user.resetPasswordHash}`
  },
  confirmRegistrationUrl: (user) => {
    return `${config.frontendUrl}/registration/confirm/${user.confirmHash}`
  }
}
