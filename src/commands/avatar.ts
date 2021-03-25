import { ICommand } from "../interfaces/ICommand";

const avatar: ICommand = {
    name: 'avatar',
    description: "Shows the message author's avatar",
    usage: 'avatar',
    execute(message, _args) {
        message.channel.send(message.author.displayAvatarURL());
    }
}

export default avatar;
