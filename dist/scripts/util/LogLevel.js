export class LogLevel {
    /**
     * Create a LogLevel object
     * @param {String} name - Description for the log level
     * @param {Number} value - Value used for thresholding. Higher -> More visibility
     */
    constructor(name, value) {
        this._name = "";
        this._value = 0;
        this._name = name;
        this._value = value;
    }
    /**
     * Get the name of the log level
     */
    get name() {
        return this._name;
    }
    /**
     * Get the value of the log level
     */
    get value() {
        return this._value;
    }
}
