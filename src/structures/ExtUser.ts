import { Structures } from "discord.js";

Structures.extend("User", User => {
    class ExtUser extends User {
        isDev: Boolean;
        constructor(client: any, data: any) {
            super(client, data);
            this.isDev = client.config.owners.includes(this.id);
        }
    }

    return ExtUser;
});