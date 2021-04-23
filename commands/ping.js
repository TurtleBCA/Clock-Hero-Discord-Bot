module.exports = {
    name: 'ping',
    description: 'this is a ping command!',
    execute(message, args, heroes, clock) {
        message.channel.send('pinged!');
    }
}