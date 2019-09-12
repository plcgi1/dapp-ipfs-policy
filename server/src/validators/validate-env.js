require('dotenv').config()
const { cleanEnv, port, str } = require('envalid')

module.exports = () => {
    cleanEnv(process.env, {
        DBHOST: str(),
        DBPASSWORD: str(),
        DBPORT: port(),
        DBUSER: str(),
        JWT_SECRET: str(),
        NODE_ENV: str(),
        FRONTEND_HOST: str(),
        GOOGLE_CLIENT_ID:  str(),
        GOOGLE_CLIENT_SECRET:  str(),
        FACEBOOK_CLIENT_ID:  str(),
        FACEBOOK_CLIENT_SECRET: str(),
        PORT: port()
    })
}
