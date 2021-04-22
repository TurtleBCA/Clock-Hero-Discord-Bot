require('dotenv').config()

const Discord = require('discord.js')

const client = new Discord.client();

client.login(process.env.BOT_TOKEN)