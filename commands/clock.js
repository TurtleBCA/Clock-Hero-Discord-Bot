const fs = require('fs');

module.exports = {
    name: 'clock',
    description: 'clock related commands',
    execute(message, args, heroes, clock, enemy) {
        const subcommand = args[0];

        if (!(message.author.toString() in clock)) {
            message.channel.send('You must create a character first');
            return;
        }

        if (subcommand === 'goal') {
            if (args.length == 1) {
                message.channel.send(`Goal: ${clock[message.author.toString()].goal} minutes`);
            } else if (args.length == 2) {
                const minutes = parseInt(args[1]);
                if (args[1][0] == '+' || args[1][0] == '-') {
                    message.channel.send(`Goal: ${clock[message.author.toString()].goal} -> ${Math.max(clock[message.author.toString()].goal + minutes, 0)}`);
                    clock[message.author.toString()].goal = Math.max(clock[message.author.toString()].goal + minutes, 0);
                } else {
                    clock[message.author.toString()].goal = minutes;
                    message.channel.send(`Goal has been set to ${clock[message.author.toString()].goal} minutes`);
                }
            }
        } else if (subcommand === 'log') {
            if (args.length == 1) {
                message.channel.send(`Log: ${clock[message.author.toString()].log} minutes`);
            } else if (args.length == 2) {
                const minutes = parseInt(args[1]);
                if (args[1][0] == '+' || args[1][0] == '-') {
                    message.channel.send(`Log: ${clock[message.author.toString()].log} -> ${Math.max(clock[message.author.toString()].log + minutes, 0)}`);
                    clock[message.author.toString()].log = Math.max(clock[message.author.toString()].log + minutes, 0);
                } else {
                    clock[message.author.toString()].log = minutes;
                    message.channel.send(`Log has been set to ${clock[message.author.toString()].log} minutes`);
                }
            }
        }

        fs.writeFile('clock.json', JSON.stringify(clock), (err) => {});
    }
}