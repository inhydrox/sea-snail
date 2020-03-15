const { Client } = require("discord.js");
const { resolve } = require("path");
const CommandHandler = require("./CommandHandler");
const EventHandler = require("./EventHandler");
require("../structures/ExtGuildMember");
require("../structures/ExtMessage");
require("../structures/ExtUser");

/**
 * @extends {Client}
 */
class SSnailClient extends Client {
    /**
     * @param {import("discord.js").ClientOptions} [opt]
     */
    constructor(opt) {
        super(opt);
        this.config = require("../config.json");
        this.request = require("superagent");
        this.commandHandler = new CommandHandler(this, resolve(__dirname, "..", "commands"));
        this.eventHandler = new EventHandler(this, resolve(__dirname, "..", "events"));
    }

    build() {
        this.commandHandler.build();
        this.eventHandler.build();
        this.login(process.env.TOKEN);
    }
}

module.exports = SSnailClient;