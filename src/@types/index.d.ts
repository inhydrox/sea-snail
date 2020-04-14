import { Client, Message } from "discord.js";
import SSnailClient from "src/handler/SSnailClient";

export class Command {
    name: String;
    aliases?: Array<String>;
    cooldown?: Number;
    guildOnly?: Boolean;
    ownerOnly?: Boolean;
    desc?: String;
    usage?: String;
    path?: String;
    module?: Module;

    exec(message: ExtMessage): void;
}

export interface Module {
    name: String,
    path: String,
    commands: Array<Command>
}

export class Event {
    name: String;

    exec(client: Client, ...args: any[]): void;
}

export class ExtMessage extends Message {
    client: SSnailClient;
    command: String | null;
    args: Array<String>;
    flag: Array<String>;
}