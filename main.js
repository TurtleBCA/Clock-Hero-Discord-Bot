require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';
const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
const commandSet = new Set()
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    commandSet.add(command.name);
}

let heroes = {};
try {
    heroes = JSON.parse(fs.readFileSync('heroes.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('heroes.json', '{}');
}

let clock = {}
try {
    clock = JSON.parse(fs.readFileSync('clock.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('clock.json', '{}');
}

let lastDate = new Date().getDate();
try {
    lastDate = parseInt(fs.readFileSync('lastDate.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('lastDate.json', `${lastDate}`);
}

let enemy = {};
try {
    enemy = JSON.parse(fs.readFileSync('enemy.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('enemy.json', '{}');
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    if (lastDate != new Date().getDate()) {
        console.log(":o")
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    for (let i = 0; i < args.length; i++) {
        args[i].toLowerCase();
    }
    const command = args.shift();

    if (commandSet.has(command)) {
        client.commands.get(command).execute(message, args, heroes, clock, enemy);
    }
});

client.login(process.env.BOT_TOKEN);