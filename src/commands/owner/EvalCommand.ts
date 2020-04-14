import { Command, ExtMessage } from "@type/index";
import SSnailClient from "../../handler/SSnailClient";
import { MessageEmbed } from "discord.js";

class EvalCommand implements Command {
    name = "eval";
    aliases = ["e", "ev", "evaluate"];
    ownerOnly = true;
    desc = "Evaluate to the Bot";
    usage = "eval <code>";

    async exec(message: ExtMessage) {
        const runnedtimestamp = message.createdTimestamp;
        const msg = message;
        const bot = message.client;
        const client = message.client;

        const {
            args,
            flag
        } = message;

        const embed = new MessageEmbed();

        try {
            const code = args.join(" ");
            if (!code) return;
            let evaled;

            if (flag.includes("async")) evaled = await eval(`(async () => { ${code} })()`); // eslint-disable-line
            else evaled = eval(code); // eslint-disable-line

            if (flag.includes("silent")) return;

            if (typeof evaled !== "string") {
                evaled = require("util").inspect(evaled, {
                    depth: 0
                });
                evaled = evaled.replace(bot.token, "[TOKEN]");
            }
            const output = this.clean(evaled);
            let result;
            if (output.length > 2000) {
                const {
                    body: {
                        key
                    }
                } = await message.client.request.post("https://bin.zealcord.xyz/documents").send(output);
                result = `https://bin.zealcord.xyz/${key}`;
            } else result = output;
            embed
                .setAuthor("Output")
                .setColor("0x42f468");

            const isURL = this.validateURL(result);
            if (flag.includes("no-embed")) {
                message.channel.send(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
                return;
            }
            embed.setDescription(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
        } catch (e) {
            const error = this.clean(e);
            let result;
            if (error.length > 2000) {
                const {
                    body: {
                        key
                    }
                } = await client.request.post("https://bin.zealcord.xyz/documents").send(error);
                result = `https://bin.zealcord.xyz/${key}`;
            } else result = error;

            embed
                .setAuthor("Error")
                .setColor("0xff0000");

            const isURL = this.validateURL(result);

            if (flag.includes("no-embed")) {
                message.channel.send(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
                return;
            }
            embed.setDescription(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
        }

        embed.setFooter(`⏱️ ${Date.now() - runnedtimestamp}ms`);
        message.channel.send(embed);
    }

    clean(text: String) {
        if (typeof text === "string") {
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        } else return text;
    }

    validateURL(str: String) {
        const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
        return !!pattern.test(str as string);
    }
}

export default EvalCommand;