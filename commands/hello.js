module.exports = {
    name: 'hello',
	description: 'Replies with a greeting to the user',
    usage: 'hello',
	execute(message, args) {
		message.channel.send(`Hello, ${message.author.username}`);
	},
}
