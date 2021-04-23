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
                heroes[message.author.toString()] = {name: args[1], currentHP: 20, totalExp: 0, level: 1, health: 1, attack: 1, defense: 1};
                clock[message.author.toString()] = {goal: 240, log: 0};
            }
        } else if (subcommand === 'info') {
            if (args.length) {
                const hero = heroes[message.author.toString()];
                const maxHP = Math.ceil(Math.pow(hero.health, Math.log(9981) / Math.log(100)) + 19);
                let currentExp = hero.totalExp - ((hero.level - 1) * (10 + 10 + hero.level - 2) / 2);
                message.channel.send(`${hero.name}: HP ${hero.currentHP}/${maxHP} \\|\\| Lv. ${hero.level} ${currentExp}/${20+hero.level-1} \\|\\| Stat ${hero.health}/${hero.attack}/${hero.defense}`);
            }
        }

        fs.writeFile('heroes.json', JSON.stringify(heroes), (err) => {});
        fs.writeFile('clock.json', JSON.stringify(clock), (err) => {});
    }
}