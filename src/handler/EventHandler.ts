import { readdir, PathLike } from "fs";
import SSnailClient from "./SSnailClient";
import { Event } from "@type/index";

class EventHandler {
    client: SSnailClient;
    path: String;
    constructor(client: SSnailClient, path: String) {
        this.client = client;
        this.path = path;
    }

    build() {
        readdir(this.path as PathLike, (err, files) => {
            // @ts-ignore
            if (err) throw Error(err);
            console.log(`Listening ${files.length} events..`);
            for (const file of files) {
                // eslint-disable-next-line new-cap
                const event: Event = new (require(`${this.path}/${file}`)).default();
                this.client.on(event.name as any, (...args) => event.exec(this.client, ...args));
            }
        });
    }
}

export default EventHandler;