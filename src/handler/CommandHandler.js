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
            console.log("Loaded!");
        });

        this.client.on("message", message => {
            const prefix = this.client.config.prefix;

            if (message.author.bot) return;
            if (!message.content.startsWith(prefix)) return;
            const queries = message.content.slice(prefix.length).trim().split(/ +/g);
            const commandName = queries.shift().toLocaleLowerCase();
            message.args = []
            message.flags = [];
            for (const query of queries) {
                if (query.startsWith("--")) message.flags.push(query.slice(2).toLowerCase());
                    else message.args.push(query);
            }

            const command = this.commands.get(commandName) || this.commands.find(c => c.aliases.includes(commandName));
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