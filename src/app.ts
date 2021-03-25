import express from "express";
import { TextChannel, Client, Collection, Message } from "discord.js";
import fs from "fs";
import { IClient } from "./interfaces/IClient";
import { config } from "dotenv";

config();

const client: IClient = new Client();
client.commands = new Collection();

// Command prefix
const prefix = process.env.PREFIX || "!";
client.login(process.env.DISCORD_BOT_TOKEN);

// Get all command file names
const fileExtension = process.env.NODE_ENV === "development" ? ".ts" : ".js"
const commandFiles = fs.readdirSync(fs.realpathSync('./src/commands')).filter(file => file.endsWith(fileExtension));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.default.name, command.default);
}

let channel: TextChannel;

client.on('ready', async () => {
    // channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_NUMBER);

    // create new channel called "issues" if does not exist
    const guild = client.guilds.cache.find((g) => g.name === 'server-name');
    guild?.channels.create('issues').then((c: TextChannel) => {
        channel = c;
    }).catch((err: any) => { console.log(err) });
    console.log("Bot is ready");
})

client.on('message', (msg: Message) => {
    // ignore if a bot sends the message
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    // Good way for small bots
    // if(command === 'ping')
    //     return msg.reply('pong');
    // if(command === 'hello')
    //     return msg.reply(`Hello, ${msg.author.username}`);
    if (!commandName) {
        return;
    }
    if (!client.commands?.has(commandName))
        return msg.reply('No such command. Use `;;help` to find more info')

    const command = client.commands.get(commandName);

    // check if required args are provided
    if (!command) {
        return;
    }
    if (command.args && !args.length) {
        return msg.reply("No arguments provided :(");
    }
    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
    return;
});

client.on("githubMessage", (msg) => {
    channel.send(`New issue created: ${msg.issue.html_url}`);
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
