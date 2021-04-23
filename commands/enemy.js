const fs = require('fs');

function power(level) {
    return Math.pow(level, 1.5);
}

function health(level) {
    return Math.pow(level, Math.log(9981) / Math.log(100)) + 19;
}

function damage(attack, defense) {
    return Math.ceil((attack * attack) / (attack + defense));
}

function lowerBound(lo, hi, method) {
    while (lo < hi) {
        console.log(lo, hi)
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
        result += 10 * damage(power(hero.attack), power(defense));
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
            let healthLvl = lowerBound(1, 1000, (level) => {return health(level) / maxCombinedDamage >= parseInt(args[2])});
            
            let attack = upperBound(1, 1000, (level) => {
                let minHits = Infinity;
                for (const hero of Object.values(heroes)) {
                    minHits = Math.min(minHits, health(hero.health) / damage(power(level), power(hero.defense)));
                }
                return minHits >= parseInt(args[1]);
            });
            let minHits = Infinity;
                for (const hero of Object.values(heroes)) {
                    minHits = Math.min(minHits, health(hero.health) / damage(power(attack), power(hero.defense)));
                }
            console.log(minHits);

            // optimize health/defense pairing
            let total = healthLvl + attack;
            let defense = 3 - total % 3;
            total = healthLvl + attack + defense;
            while (true) {
                let currentHits = health(healthLvl) / calcMaxCombinedDamage(heroes, defense);
                console.log(healthLvl, defense, currentHits);
                if (health(healthLvl - 1) / calcMaxCombinedDamage(heroes, defense + 1) > currentHits) {
                    healthLvl--;
                    defense++;
                } else if (health(healthLvl + 1) / calcMaxCombinedDamage(heroes, defense - 1) > currentHits) {
                    healthLvl++;
                    defense--;
                } else {
                    break;
                }
            }

            enemy = {name: "name", description: "desc", image: "", level: total / 3, health: healthLvl, attack: attack, defense: defense};
            message.channel.send(JSON.stringify(enemy));
        }

        fs.writeFile('enemy.json', JSON.stringify(enemy), (err) => {});
    }
}