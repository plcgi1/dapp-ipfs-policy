require('dotenv').config()
const {cleanEnv, port, str} = require('envalid')

module.exports = () => {
  cleanEnv(process.env, {
    DBHOST: str(),
    DBPASSWORD: str(),
    DBPORT: port(),
    DBUSER: str(),
    JWT_SECRET: str(),
    NODE_ENV: str(),
    PORT: port()
  })
}
