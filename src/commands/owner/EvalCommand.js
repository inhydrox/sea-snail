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
        const code = args.join(" ");

        if (!code) return;
        let { success, result } = await this.evaluate(flags.includes("async") ? `(async () => { ${code} })()` : code);
        if (flags.includes("silent")) return;

        if (result.length > 2000) {
            const { body: { key } } = await client.request.post("https://bin.zealcord.xyz/documents").send(output);
            result = `https://bin.zealcord.xyz/${key}`;
        }

        const embed = new MessageEmbed()
            .setAuthor(success ? "Output" : "Error")
            .setColor(success ? "0x42f468" : "0xff0000");

        const isURL = this.validateURL(result);
        if (flags.includes("no-embed")) {
            message.channel.send(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
            return;
        }
        embed.setDescription(isURL ? result : `\`\`\`js\n${result}\n\`\`\``);
        embed.setFooter(`⏱️ ${Date.now() - runnedtimestamp}ms`);
        message.channel.send(embed);
    }

    async evaluate(code) {
        let evaled = {};
        try {
            let result;
            if (flags.includes("async")) result = await eval(`(async () => { ${code} })()`);
            else result = eval(code);

            result = result.replace(bot.token, "[TOKEN]");
            if (typeof result !== "string") {
                result = require("util").inspect(result, {
                    depth: 0
                });
            }

            evaled.success = true;
            evaled.result = this.clean(result);
        } catch (e) {
            evaled.success = false;
            evaled.result = this.clean(e.message);
        }
        return evaled;
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