const fs = require('fs');

module.exports = {
    name: 'clock',
    description: 'clock related commands',
    execute(message, args, heroes, clock) {
        const subcommand = args[0];

        if (!(message.author.toString() in clock)) {
            message.channel.send('You must create a character first');
        }

        if (subcommand === 'goal') {
            if (args.length == 1) {
                message.channel.send(`Goal: ${clock[message.author.toString()].goal} minutes`);
            } else if (args.length == 2) {
                clock[message.author.toString()].goal = args[1];
                message.channel.send(`Goal has been set to ${clock[message.author.toString()].goal} minutes`);
            }
        } else if (subcommand === 'log') {
            if (args.length == 1) {
                message.channel.send(`Log: ${clock[message.author.toString()].log} minutes`);
            } else if (args.length == 2) {
                clock[message.author.toString()].log = args[1];
                message.channel.send(`Log has been set to ${clock[message.author.toString()].log} minutes`);
            }
        }

        fs.writeFile('clock.json', JSON.stringify(clock), (err) => {});
    }
}