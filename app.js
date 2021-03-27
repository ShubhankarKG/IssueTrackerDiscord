const express = require("express");
const Discord = require("discord.js");
const fs = require("fs");

require("dotenv").config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Command prefix
const prefix = process.env.PREFIX;

client.login(process.env.DISCORD_BOT_TOKEN);

// Get all command file names
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

let channel;

client.on('ready', async () => {
    channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_NUMBER);

    // create new channel called "issues" if does not exist
    // channel = client.channels.cache.find((c) => c.name === 'issues');
    // if (!channel) {
    //     msg.guild.channels.create('issues')
    //         .then((c) => {
    //             channel = c;
    //         }).catch((err) => { console.log(err) });
    // }
    console.log("Bot is ready");
})

client.on('message', (msg) => {
    // ignore if a bot sends the message
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Good way for small bots
    // if(command === 'ping')
    //     return msg.reply('pong');
    // if(command === 'hello')
    //     return msg.reply(`Hello, ${msg.author.username}`);

    if (!client.commands.has(commandName))
        return msg.reply('No such command. Use `;;help` to find more info')

    const command = client.commands.get(commandName);

    // check if required args are provided
    if (command.args && !args.length) {
        return msg.reply("No arguments provided :(");
    }
    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});

client.on("githubMessage", (msg) => {
    if (msg.action === "opened") {
        const issue = msg.issue;
        const embed = "New issue created: " + issue.html_url;
        channel.send(embed);
    } else {
        // We don't do that here;
        return;
    }

});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/github", async (req, res) => {
    client.emit("githubMessage", req.body);
    res.status(200).json({ result: "success" });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
