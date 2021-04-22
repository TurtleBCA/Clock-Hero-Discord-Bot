require('dotenv').config()

const Discord = require('discord.js')

const client = new Discord.Client()
const prefix = '!'

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.channel.send('pinged');
    }
})

client.login(process.env.BOT_TOKEN)