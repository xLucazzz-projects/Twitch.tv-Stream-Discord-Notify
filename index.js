const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const fs = require('fs')
const colors = require('colors')

fs.readdir(`./events/`, (err, files) => {
    if (err) return console.log("Evento não encontrado.")
    console.log(colors.cyan("[Info] ") + "Importação dos eventos iniciada!\n")

    var jsfile = files.filter(f => f.split(".").pop() === "js")
    jsfile.forEach((f, i) => {
        console.log(colors.red('-> ') + ('O evento ' + colors.green(f) + ' foi carregado com sucesso.'))
        if (err) console.log(colors.red('-> ') + 'O evento ' + colors.red(f) + ' não foi carregado com sucesso.')

        var event = require(`./events/${f}`)
        var eventName = f.split('.js')[0]
        client.on(eventName, event.bind(null, client))
    });
});


client.login(config.bot.token)