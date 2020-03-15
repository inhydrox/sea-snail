const { Client } = require("discord.js");
const { resolve } = require("path");
const CommandHandler = require("./CommandHandler");
require("../structures/ExtGuildMember");
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
    }

    build() {
        this.commandHandler.build();
        this.login(process.env.TOKEN);
        this.on("ready", () => console.log("Logged in"));
    }
}

module.exports = SSnailClient;