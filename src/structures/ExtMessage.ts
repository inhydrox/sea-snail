import { Structures } from "discord.js";
import { prefix } from "../config.json";
import SSnailClient from "src/handler/SSnailClient";

Structures.extend("Message", Message => {
    class ExtMessage extends Message {
        command: String | null;
        args: Array<String>;
        flag: Array<String>;
        constructor(client: any, data: any, channel: any) {
            super(client, data, channel);
            const queries: Array<String> = this.content.slice(prefix.length).trim().split(/ +/g);
            const command = this.content.startsWith(prefix) ? queries.shift()?.toLocaleLowerCase() || null : null;
            this.command = command;
            this.args = [];
            this.flag = [];
            for (const query of queries) {
                if (query.startsWith("--")) this.flag.push(query.slice(2).toLowerCase());
                else this.args.push(query);
            }
        }
    }

    return ExtMessage;
});