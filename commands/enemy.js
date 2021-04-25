const fs = require('fs');
const formulas = require('../formulas.js');
const Discord = require('discord.js');

function lowerBound(lo, hi, method) {
    while (lo < hi) {
        mid = Math.floor((hi + lo) / 2);
        if (method(mid)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}

function calcMaxCombinedDamage(heroes, defense) {
    let result = 0;
    for (const hero of Object.values(heroes)) {
        result += 10 * formulas.damage(formulas.power(hero.attack), formulas.power(defense));
    }
    return result;
}

function upperBound(lo, hi, method) {
    while (lo < hi) {
        mid = Math.floor((hi + lo + 1) / 2);
        if (method(mid)) {
            lo = mid;
        } else {
            hi = mid - 1;
        }
    }
    return hi;
}

module.exports = {
    name: 'enemy',
    description: 'enemy related commands',
    execute(message, args, heroes, clock, enemy) {
        const subcommand = args[0];

        // if (JSON.stringify(enemy) === '{}') {
        //     message.channel.send('No enemy exists at the moment');
        //     return;
        // }

        if (subcommand === 'generate') {
            if (args.length != 3) {
                message.channel.send('syntax is `!enemy generate *heroHits* *bossDays*`')
                return;
            }
            // optimize health and attack separately
            let maxCombinedDamage = calcMaxCombinedDamage(heroes, 0);
            let healthLvl = lowerBound(1, 1000, (level) => {return formulas.health(level) / maxCombinedDamage >= parseInt(args[2])});
            
            let attack = upperBound(1, 1000, (level) => {
                let minHits = Infinity;
                for (const hero of Object.values(heroes)) {
                    minHits = Math.min(minHits, formulas.health(hero.health) / formulas.damage(formulas.power(level), formulas.power(hero.defense)));
                }
                return minHits >= parseInt(args[1]);
            });
            let minHits = Infinity;
                for (const hero of Object.values(heroes)) {
                    minHits = Math.min(minHits, formulas.health(hero.health) / formulas.damage(formulas.power(attack), formulas.power(hero.defense)));
                }

            // optimize health/defense pairing
            let total = healthLvl + attack;
            let defense = 3 - total % 3;
            total = healthLvl + attack + defense;
            while (true) {
                let currentHits = formulas.health(healthLvl) / calcMaxCombinedDamage(heroes, defense);
                console.log(healthLvl, defense, currentHits);
                if (formulas.health(healthLvl - 1) / calcMaxCombinedDamage(heroes, defense + 1) > currentHits) {
                    healthLvl--;
                    defense++;
                } else if (formulas.health(healthLvl + 1) / calcMaxCombinedDamage(heroes, defense - 1) > currentHits) {
                    healthLvl++;
                    defense--;
                } else {
                    break;
                }
            }

            enemy = {name: "name", description: "desc", image: "", currentHP: Math.ceil(formulas.health(healthLvl)), level: total / 3, health: healthLvl, attack: attack, defense: defense, work: {}};
            message.channel.send(JSON.stringify(enemy));
        } else if (subcommand === 'info') {
            const newEmbed = new Discord.MessageEmbed()
            .setTitle(`Lv. ${enemy.level} ${enemy.name}`)
            .setDescription(`${enemy.description}`)
            .addFields(
                {name: 'Stats', value: `HP ${enemy.currentHP}/${Math.ceil(formulas.health(enemy.health))} \\|\\| Stat ${enemy.health}/${enemy.attack}/${enemy.defense}`},
                {name: 'Work', value: `${Object.keys(enemy.work).map(id => `${heroes[id].name}: ${enemy.work[id]}`).join('\n') || 'No work yet'}`}
            ).setImage(`${enemy.image}`);

            message.channel.send(newEmbed);
        } else if (subcommand === 'set') {
            if (args.length < 3) {
                message.channel.send('syntax is `!enemy set {name|description|image} *stuff*`')
            } else if (['name', 'description', 'image'].includes(args[1])) {
                everythingElse = args.slice(2).join(' ');
                enemy[args[1]] = everythingElse;
            } else {
                message.channel.send('syntax is `!enemy set {name|description|image} *stuff*`')
            }
        } else {
            return;
        }

        fs.writeFile('enemy.json', JSON.stringify(enemy), (err) => {});
    }
}