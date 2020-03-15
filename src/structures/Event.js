/**
 * @class Event
 */
class Event {
    constructor() {
        /**
         * @type {String}
         */
        this.name = null;
        /**
         * @type {String}
         */
        this.path = null;
    }

    /**
     * @param {import("../handler/SSnailClient")} client
     * @param {*} args
     */
    exec(client, ...args) {}
}

module.exports = Event;