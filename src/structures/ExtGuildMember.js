const { Structures } = require("discord.js");

Structures.extend("GuildMember", GuildMember => {
    class ExtGuildMember extends GuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
            this.isDev = this.user.isDev;
        }
    }

    return ExtGuildMember;
});