const Command = require("../../structures/Command");

/**
 * @extends {Command}
 */
class PingCommand extends Command {
    constructor() {
        super();
        this.name = "ping";
        this.aliases = ["pang", "pung", "peng", "pong"];
        this.desc = "WebSocket ping";
        this.usage = "ping";
    }

    /**
     * @param {import("../../handler/SSnailClient")} client
     * @param {import("../../structures/ExtMessage")} message
     */
    exec(client, message) {
        message.channel.send(`Pong! \`${client.ws.ping.toFixed(0)}ms\``);
    }
}

module.exports = PingCommand;