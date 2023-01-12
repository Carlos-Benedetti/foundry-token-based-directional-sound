import { LogLevel } from "./LogLevel";
export default class Logger {
    /**
     * Initializes the Logger object with a mod name and a log level
     * @param {String} name - The module name, prefixed to all log messages
     * @param {LogLevel} threshold - The minimum level of log messages to display
     */
    static init(name, threshold) {
        Logger.moduleName = name;
        Logger.threshold = threshold;
        this.log(threshold, `Set log threshold to ${threshold.name}`);
    }
    static log(level, ...message) {
        if (Logger.threshold.value <= level.value) {
            console.log(...[`[${this.moduleName}]: `, ...message]);
        }
    }
}
/**
 * Displays information of develepment concerns
 */
Logger.Low = new LogLevel("low", 1);
/**
 * Displays information for unusual circumstances
 */
Logger.Medium = new LogLevel("medium", 2);
/**
 * Displays information for user visible changes
 */
Logger.High = new LogLevel("high", 3);
/**
 * Used to display no logging
 */
Logger.None = new LogLevel("none", Infinity);
/**
 * Stores the name of the module
 */
Logger.moduleName = "Unnamed Module";
/**
 * The current debug threshold
 */
Logger.threshold = Logger.None;
