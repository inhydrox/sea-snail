const Event = require("../structures/Event");

/**
 * @extends {Event}
 */
class ReadyEvent extends Event {
    constructor() {
        super();
        this.name = "ready";
    }

    /**
     * @param {import("../handler/SSnailClient")} client
     */
    exec(client) {
        console.log(`Logged in as ${client.user.tag}.`);
    }
}

module.exports = ReadyEvent;