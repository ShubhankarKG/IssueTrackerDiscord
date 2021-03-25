module.exports = {
    name: 'avatar',
    description: "Shows the message author's avatar",
    usage: 'avatar',
    execute(message, args){
        message.channel.send(message.author.displayAvatarURL());
    }
}
