const TwitchNotify = require('../modules/twitchNotify')

module.exports = async client => {
    console.log("Bot iniciado")

    TwitchNotify.start(client)
}