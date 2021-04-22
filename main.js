require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';
const fs = require('fs');

client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const commandSet = new Set()
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    commandSet.add(command.name);
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (commandSet.has(command)) {
        client.commands.get(command).execute(message, args);
    }
});

client.login(process.env.BOT_TOKEN);