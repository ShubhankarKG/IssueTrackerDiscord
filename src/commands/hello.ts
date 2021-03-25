import { ICommand } from "../interfaces/ICommand";

const hello: ICommand = {
	name: 'hello',
	description: 'Replies with a greeting to the user',
	usage: 'hello',
	execute(message, _args) {
		message.channel.send(`Hello, ${message.author.username}`);
	},
}

export default hello;
