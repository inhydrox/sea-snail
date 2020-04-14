import { Structures } from "discord.js";

Structures.extend("GuildMember", GuildMember => {
    class ExtGuildMember extends GuildMember {
        isDev: Boolean;
        constructor(client: any, data: any, guild: any) {
            super(client, data, guild);
            // @ts-ignore
            this.isDev = this.user.isDev;
        }
    }

    return ExtGuildMember;
});