import { ICommand } from "../interfaces/ICommand";

const issues: ICommand = {
    name: 'issues',
    description: "Shows the issues of a repo",
    usage: 'issues <repo_owner_name> <repo_name>',
    args: true,
    execute(message, args) {
        const owner = args[0];
        const repo = args[1];
        message.channel.send(`This will show all issues from ${repo} owned by ${owner}`);
    }
}

export default issues;
