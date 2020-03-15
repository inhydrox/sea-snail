/**
 * @class Module
 */
class Module {
    /**
     * @param {Object} data
     * @param {String} data.name
     * @param {String} data.path
     * @param {Array<String>} data.commands
     */
    constructor(data = {}) {
        this.name = data.name;
        this.path = data.path;
        this.commands = data.commands;
    }
}

module.exports = Module;