import { Message } from "discord.js";

export interface ICommand {
    name: string;
    description: string;
    usage: string;
    args?: boolean;
    cooldown?: number;
    aliases?: Array<string>;
    execute: (message: Message, args: Array<string>) => void;
}