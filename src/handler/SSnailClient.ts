import { Client } from "discord.js";
import { resolve } from "path";
import superagent from "superagent";
import CommandHandler from "./CommandHandler";
import EventHandler from "./EventHandler";
require("../structures/ExtGuildMember");
require("../structures/ExtMessage");
require("../structures/ExtUser");

class SSnailClient extends Client {
    config: any = require("../config.json")
    request: superagent.SuperAgentStatic = superagent;
    commandHandler: CommandHandler = new CommandHandler(this, resolve(__dirname, "..", "commands"));
    eventHandler: EventHandler = new EventHandler(this, resolve(__dirname, "..", "events"));

    build() {
        this.commandHandler.build();
        this.eventHandler.build();
        this.login(process.env.TOKEN);
    }
}

export default SSnailClient;
