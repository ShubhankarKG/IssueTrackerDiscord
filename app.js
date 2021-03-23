const express = require("express");
const Discord = require("discord.js");

require("dotenv").config();

const client = new Discord.Client();
let channel;
client.login(process.env.DISCORD_BOT_TOKEN);

client.on('ready', async () => {
    channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_NUMBER);
    console.log("Bot is ready");
})

client.on('message', (msg) => {
    if (msg.content === "Hello") {
        msg.reply("Hi!")
    }
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

const port = process.eventNames.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})