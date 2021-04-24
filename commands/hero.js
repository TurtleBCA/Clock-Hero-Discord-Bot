const fs = require('fs');

module.exports = {
    name: 'hero',
    description: 'hero related commands',
    execute(message, args, heroes, clock, enemy) {
        const subcommand = args[0];
        if (subcommand === 'new') {
            if (message.author.toString() in heroes) {
                message.channel.send('you already have a character');
            } else {
                if (args.length != 2) {
                    message.channel.send('syntax is `!hero new *name*`')
                    return;
                }

                message.channel.send('creating one');
                heroes[message.author.toString()] = {name: args[1], currentHP: 20, totalExp: 0, level: 1, health: 1, attack: 1, defense: 1, points: 0};
                clock[message.author.toString()] = {goal: 240, log: 0};
            }
        } else if (subcommand === 'info') {
            if (args.length) {
                const hero = heroes[message.author.toString()];
                const maxHP = Math.ceil(Math.pow(hero.health, Math.log(9981) / Math.log(100)) + 19);
                let currentExp = hero.totalExp - ((hero.level - 1) * (10 + 10 + hero.level - 2) / 2);
                message.channel.send(`${hero.name}: HP ${hero.currentHP}/${maxHP} \\|\\| Lv. ${hero.level} ${currentExp}/${20+hero.level-1} \\|\\| Stat ${hero.health}/${hero.attack}/${hero.defense}, Points: ${hero.points}`);
            }
        } else if (subcommand === 'allocate') {
            if (args.length != 3) {
                message.channel.send('syntax is `!hero allocate {health|attack|defense} *amount*`');
            } else if (parseInt(args[2]) > heroes[message.author.toString()].points) {
                message.channel.send(`You don't have enough points (you only have ${heroes[message.author.toString()].points})`);
            } else if (['health', 'attack', 'defense'].includes(args[1])) {
                message.channel.send(`${args[1]}: ${heroes[message.author.toString()][args[1]]} -> ${heroes[message.author.toString()][args[1]] + parseInt(args[2])}`);
                heroes[message.author.toString()][args[1]] += parseInt(args[2]);
                heroes[message.author.toString()].points -= parseInt(args[2]);
            } else {
                message.channel.send('Unable to complete your command. Did you misspell something?');
            }
        }

        fs.writeFile('heroes.json', JSON.stringify(heroes), (err) => {});
        fs.writeFile('clock.json', JSON.stringify(clock), (err) => {});
    }
}