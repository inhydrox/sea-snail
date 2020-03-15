/**
 * @class Command
 */
class Command {
    constructor() {
        /**
         * @type {String}
         */
        this.name = null;
        /**
         * @type {Array<String>}
         */
        this.aliases = [];
        /**
         * @type {Number}
         */
        this.cooldown = 2;
        /**
         * @type {Boolean}
         */
        this.guildOnly = false;
        /**
         * @type {Boolean}
         */
        this.ownerOnly = false;
        /**
         * @type {Object}
         */
        this.desc = null;
        /**
         * @type {String}
         */
        this.usage = null;
        /**
         * @type {String}
         */
        this.path = null;
        /**
         * @type {String}
         */
        this.module = null;
    }

    /**
     * @param {import("../handler/SSnailClient)} client
     * @param {import("discord.js").Message} message
     */
    exec(client, message) {}
}

module.exports = Command;