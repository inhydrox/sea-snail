const { readdir } = require("fs");

/**
 * @class EventHandler
 */
class EventHandler {
    /**
     * @param {import("./SSnailClient")} client
     * @param {String} path
     */
    constructor(client, path) {
        /**
         * @type {import("./BaldClient")}
         */
        this.client = client;
        /**
         * @type {String}
         */
        this.path = path;
    }

    build() {
        readdir(this.path, (err, files) => {
            if (err) throw Error(err);
            console.log(`Listening ${files.length} events..`);
            for (const file of files) {
                const event = new (require(`${this.path}/${file}`))();
                this.client.on(event.name, (...args) => event.exec(this.client, ...args));
            }
        });
    }
}

module.exports = EventHandler;