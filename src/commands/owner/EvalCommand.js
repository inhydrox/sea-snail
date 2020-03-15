const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

/**
 * @extends {Command}
 */
class EvalCommand extends Command {
    constructor() {
        super();
        this.name = "eval";
        this.aliases = ["e", "ev", "evaluate"];
        this.desc = "Evaluate to the Bot";
        this.usage = "eval <code>";
    }

    /**
     * @param {import("../../handler/SSnailClient")} client
     * @param {import("../../structures/ExtMessage")} message
     */
    async exec(client, message) {
        const runnedtimestamp = message.createdTimestamp;
        const msg = message;
        const bot = client;
        const { args, flags } = message;

        const embed = new MessageEmbed();

        try {
            const code = args.join(" ");
            if (!code) return;
            let evaled;

            if (flags.includes("async")) evaled = await eval(`(async () => { ${code} })()`);
            else evaled = eval(code);

            if (flags.includes("silent")) return;

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
                } = await client.request.post("https://bin.zealcord.xyz/documents").send(output);
                result = `https://bin.zealcord.xyz/${key}`;
            } else result = output;
            embed
                .setAuthor("Output")
                .setColor("0x42f468");

            const isURL = this.validateURL(result);
            if (flags.includes("no-embed")) {
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

            if (flags.includes("no-embed")) {
                message.channel.send(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
                return;
            }
            embed.setDescription(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
        }

        embed.setFooter(`⏱️ ${Date.now() - runnedtimestamp}ms`);
        message.channel.send(embed);
    }


    clean(text) {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    }

    validateURL(str) {
        const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
        return !!pattern.test(str);
    }
}

module.exports = EvalCommand;