import { Collection } from "discord.js";
import { readdir, PathLike } from "fs";
import { resolve } from "path";
import SSnailClient from "./SSnailClient";
import { Command, Module, ExtMessage } from "@type/index";

/**
 * @class CommandHandler
 */
class CommandHandler {
    client: SSnailClient;
    path: String;
    modules: Collection<String, Module> = new Collection();
    commands: Collection<String, Command> = new Collection();
    constructor(client: SSnailClient, path: String) {
        this.client = client;
        this.path = path;
    }

    build() {
        readdir(this.path as PathLike, (err, dirs) => {
            // @ts-ignore
            if (err) throw Error(err);
            console.log(`Loading commands from ${dirs.length} categories...`);
            for (const dir of dirs) {
                const moduleDir = resolve(this.path as string, dir);
                const moduleConf: Module = {
                    name: dir,
                    path: moduleDir,
                    commands: []
                };
                readdir(moduleDir, (err, files) => {
                    // @ts-ignore
                    if (err) throw Error(err);
                    for (const file of files) {
                        const commandPath = resolve(moduleDir, file);
                        // eslint-disable-next-line new-cap
                        const command: Command = new (require(commandPath)).default();
                        command.path = commandPath;
                        command.module = moduleConf;
                        moduleConf.commands.push(command);
                        this.commands.set(command.name, command);
                    }
                });
                this.modules.set(dir, moduleConf);
            }
        });

        // @ts-ignore
        this.client.on("message", (message: ExtMessage) => {
            if (message.author.bot) return;
            // @ts-ignore
            const command: Command = this.commands.get(message.command) || this.commands.find(c => c.aliases.includes(message.command));
            if (!command) return;
            if (command.guildOnly && message.channel.type === "dm") return;
            // @ts-ignore
            if (command.ownerOnly && !message.author.isDev) return;

            try {
                command.exec(message);
            } catch (e) {
                console.error(e.stack);
            }
        });
    }
}

export default CommandHandler;