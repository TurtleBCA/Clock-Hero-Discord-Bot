const fs = require('fs');

module.exports = {
    name: 'hero',
    description: 'hero related commands',
    execute(message, args, heroes) {
        const subcommand = args[0];
        if (subcommand === 'new') {
            if (message.author.tag in heroes) {
                message.channel.send('you already have a character');
            } else {
                if (args.length != 2) {
                    message.channel.send('syntax is `!hero new *name*`')
                    return;
                }

                message.channel.send('creating one');
                heroes[message.author.tag] = {name: args[1], currentHP: 20, totalExp: 0, level: 1, health: 1, attack: 1, defense: 1};
            }
        }

        fs.writeFile('heroes.json', JSON.stringify(heroes), (err) => {});
    }
}