const axios = require('axios').default
const config = require('../config.json')
const colors = require('colors')

var token = null
var twitch = []

async function get(client) {
    if (token === null) {
        await getNewToken()
    }

    for (i = 0; i < config.twitch_notify.twitch_channels.length; i++) {
        await axios.get(`https://api.twitch.tv/helix/streams?user_login=${config.twitch_notify.twitch_channels[i]}`, {
            headers: {
                "Accept": "application/vnd.twitchtv.v5+json",
                "Client-ID": config.twitch_notify.twitch_client_id,
                "Authorization": "Bearer " + token
            }
        }).then(async response => {
            var find = twitch.find(u => u.channel === config.twitch_notify.twitch_channels[i])
            if (response.data.data.length !== 0) {
                if (!find) {
                    twitch.push({ "channel": config.twitch_notify.twitch_channels[i], "status": true })
                    console.log(colors.yellow("[TWITCH NOTIFY] ") + config.twitch_notify.twitch_channels[i] + " está " + colors.green("online"))
                    await client.channels.cache.get(config.twitch_notify.channel_notify).send(`https://twitch.tv/${config.twitch_notify.twitch_channels[i]} @everyone`)
                } else {
                    if(find.status === true) return
                    find.status = true
                    console.log(colors.yellow("[TWITCH NOTIFY] ") + config.twitch_notify.twitch_channels[i] + " está " + colors.green("online"))
                    await client.channels.cache.get(config.twitch_notify.channel_notify).send(`https://twitch.tv/${config.twitch_notify.twitch_channels[i]} @everyone`)
                }
            }

            if (response.data.data.length === 0) {
                if (!find) {
                    console.log(colors.yellow("[TWITCH NOTIFY] ") + config.twitch_notify.twitch_channels[i] + " está " + colors.red("offline"))
                    twitch.push({ "channel": config.twitch_notify.twitch_channels[i], "status": false })
                } else {
                    if(find.status === false) return
                    console.log(colors.yellow("[TWITCH NOTIFY] ") + config.twitch_notify.twitch_channels[i] + " está " + colors.red("offline"))
                    find.status = false
                }
            }
        }).catch(async err => {
            if (err.response.data.status === 401) return await getNewToken()
        })

    }

}


async function start(client) {
    get(client)
    setInterval(() => {
        get(client)
    }, 15000);
}

async function getNewToken() {
    await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${config.twitch_notify.twitch_client_id}&client_secret=${config.twitch_notify.twitch_client_secret}&grant_type=client_credentials`).then(async response => token = response.data.access_token)
}

module.exports = { start }