import { ICommand } from "../interfaces/ICommand";
import { IClient } from "../interfaces/IClient"

const prefix = process.env.PREFIX;

const help: ICommand = {
        name: 'help',
        description: 'List all of my commands or info about a specific command.',
        usage: 'help <command_name>',
        cooldown: 5,
        execute(message, args) {
                const data: Array<string> = [];
                const { commands } = message.client as IClient;

                // show help for all commands
                if (!args.length) {
                        data.push('Here\'s a list of all my commands:');
                        data.push(commands!.map(command => command.name).join(', '));
                        data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

                        // send help as DM rather than spamming the channel
                        return message.author.send(data, { split: true })
                                .then(() => {
                                        if (message.channel.type === 'dm') return;
                                        message.reply('I\'ve sent you a DM with all my commands!');
                                })
                                .catch(error => {
                                        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                                        message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                                });
                }

                // Help for a specific command
                const name = args[0].toLowerCase();
                const command = commands?.get(name);

                if (!command) {
                        return message.reply('that\'s not a valid command!');
                }

                data.push(`**Name:** ${command.name}`);

                if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
                if (command.description) data.push(`**Description:** ${command.description}`);
                if (command.usage) data.push(`**Usage:** ${prefix}${command.usage}`);

                message.channel.send(data, { split: true });
                return;
        },
}

export default help;
