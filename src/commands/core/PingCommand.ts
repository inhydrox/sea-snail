import { Command } from "@type/index";
import SSnailClient from "../../handler/SSnailClient";
import { Message } from "discord.js";

class PingCommand implements Command {
    name = "ping";
    aliases = ["pang", "pung", "peng", "pong"];
    desc = "WebSocket ping";
    usage = "ping";

    exec(message: Message) {
        message.channel.send(`Pong! \`${message.client.ws.ping.toFixed(0)}ms\``);
    }
}

export default PingCommand;