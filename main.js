require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();
const prefix = '!';
const fs = require('fs');
const formulas = require('./formulas.js');

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

let clock = {lastDate: new Date().getDate()}
try {
    clock = JSON.parse(fs.readFileSync('clock.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('clock.json', JSON.stringify(clock));
}

let enemy = {};
try {
    enemy = JSON.parse(fs.readFileSync('enemy.json', 'utf8'));
} catch(err) {
    fs.writeFileSync('enemy.json', '{}');
}

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    // new day?
    let enemyExists = !(enemy && Object.keys(enemy).length === 0 && enemy.constructor === Object);
    if (enemyExists && clock.lastDate != new Date().getDate()) {
        console.log(":o")
        
        let goals = [];
        for (const hero in heroes) {
            goals.push(clock[hero].goal);
        }
        const average = formulas.average(goals);
        const standardDeviation = formulas.standardDeviation(goals);
        let maxWorkHero = '';

        for (const hero in heroes) {
            let completion = clock[hero].log / clock[hero].goal;
            heroes[hero].currentHP -= Math.ceil(10 * (1-completion) * formulas.damage(formulas.power(enemy.attack), formulas.power(heroes[hero].defense)));

            // hero runs out of HP
            if (heroes[hero].currentHP <= 0) {
                heroes[hero].currentHP = Math.ceil(formulas.health(heroes[hero].health));
                let currentExp = heroes[hero].totalExp - formulas.previousPoints(heroes[hero].level);
                heroes[hero].totalExp -= Math.min(currentExp, Math.floor((10 + heroes[hero].level - 1) / 4));
                continue;
            }

            // hero gain
            heroes[hero].currentHP = Math.min(Math.ceil(heroes[hero].currentHP + formulas.health(heroes[hero].health) / 5), Math.ceil(formulas.health(heroes[hero].health)));
            heroes[hero].totalExp += Math.floor(10 * completion);
            if (heroes[hero].totalExp >= formulas.previousPoints(heroes[hero].level+1)) {
                heroes[hero].level++;
                heroes[hero].points += 3;
            }

            const goalMultiplier = formulas.logistic(clock[hero].goal, 0, 2, 1);
            let finalDamage = Math.ceil(10 * completion * formulas.damage(formulas.power(heroes[hero].attack), formulas.power(enemy.defense)) * goalMultiplier);
            enemy.currentHP -= finalDamage;
            if (!(hero in enemy.work)) {
                enemy.work[hero] = 0;
            }
            enemy.work[hero] += finalDamage;

            if (enemy.work[hero] >= (enemy.work[maxWorkHero] ?? 0)) {
                maxWorkHero = hero;
            }
        }
        
        // enemy runs out of HP
        if (enemy.currentHP <= 0) {
            enemy = {};
            heroes[maxWorkHero].points++;
        }

        clock.lastDate = new Date().getDate();
        for (const hero in clock) {
            if (hero === 'lastDate') continue;

            clock[hero].log = 0;
        }

        fs.writeFile('clock.json', JSON.stringify(clock), (err) => {});
        fs.writeFile('heroes.json', JSON.stringify(heroes), (err) => {});
        fs.writeFile('enemy.json', JSON.stringify(enemy), (err) => {});
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