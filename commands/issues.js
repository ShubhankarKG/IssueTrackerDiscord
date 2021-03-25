const axios = require("axios");

module.exports = {
    name: 'issues',
    description: "Shows the open issues of a repo",
    usage: 'issues <repo_owner_name> <repo_name>',
    args: true,
    async execute(message, args) {
        owner = args[0];
        repo = args[1];
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`,
            {
                headers: {
                    Accept: "application/vnd.github.v3+json"
                }
            }
        )
        const data = response.data.filter((issue) => !(issue.hasOwnProperty("pull_request")))
        message.channel.send(`Okay, showing all open issues from ${repo} owned by ${owner}`);
        for (let i = 0; i < data.length; i += 1) {
            message.channel.send(data[i].html_url);
        }
    }
}
