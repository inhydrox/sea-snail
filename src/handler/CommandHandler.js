const { Collection } = require("discord.js");
const { readdir } = require("fs");
const { resolve } = require("path");

/**
 * @class CommandHandler
 */
class CommandHandler {
    /**
     * @param {import("./SSnailClient")} client
     * @param {String} path
     */
    constructor(client, path) {
        /**
         * @type {import("./SSnailClient")}
         */
        this.client = client;
        /**
         * @type {String}
         */
        this.path = path;
        /**
         * @type {import("discord.js").Collection<String, import("../structures/Module")>}
         */
        this.modules = new Collection();
        /**
         * @type {import("discord.js").Collection<String, import("../structures/Command")>}
         */
        this.commands = new Collection();
    }

    build() {
        readdir(this.path, (err, dirs) => {
            if (err) throw Error(err);
            console.log(`Loading commands from ${dirs.length} categories...`);
            for (const dir of dirs) {
                const moduleDir = resolve(this.path, dir);
                const moduleConf = new (require("../structures/Module"))({
                    name: dir,
                    path: moduleDir,
                    commands: []
                });
                readdir(moduleDir, (err, files) => {
                    if (err) throw Error(err);
                    for (const file of files) {
                        const commandPath = resolve(moduleDir, file);
                        const command = new(require(commandPath));
                        command.path = commandPath;
                        command.module = moduleConf;
                        moduleConf.commands.push(command);
                        this.commands.set(command.name, command);
                    }
                });
                this.modules.set(dir, moduleConf);
            }
        });

        this.client.on("message", message => {
            if (message.author.bot) return;
            const command = this.commands.get(message.command) || this.commands.find(c => c.aliases.includes(message.command));
            if (!command) return;
            if (command.guildOnly && message.channel.type === "dm") return;
            if (command.ownerOnly && !message.author.isDev) return;

            try {
                command.exec(this.client, message);
            } catch (e) {
                console.error(e.stack);
            }
        });
    }
}

module.exports = CommandHandler;