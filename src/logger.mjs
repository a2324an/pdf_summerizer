import os from 'os';
const DEBUG = process.env.NODE_ENV == "development";
const HOSTNAME = os.hostname();
const PAD = DEBUG ? 20 : HOSTNAME.length + 1;

function convert_to_string(o) {
    if (o instanceof Error) return (o).stack;
    else if (o instanceof Object) return JSON.stringify(o, null, 2);
    return typeof o == "string" ? o : JSON.stringify(o, null, 2);
}

/**
 * eLog - displays calling line number & message & dumps vars as pretty json string
 * @param {any} msg - string to display in log message
 * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
 * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
 * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
 * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
 */
function info(msg, ...dispVars) {
    /**
     * go one line back for the caller
     * @type {string}
     */
    const eee = new Error();
    let stackLine = eee.stack.split("\n")[2];
    /**
     * retrieve the file basename & positional data, after the last `/` to the `)`
     */
    //
    let caller_line = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
    /**
     *  test for no `/` ; if there is no `/` then use filename without a prefixed path
     */
    if (caller_line.length == 0) {
        caller_line = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
    }
    //
    /**
     * filename_base - parse out the file basename; remove first `/` char and go to `:`
     */
    const filename_base = caller_line.slice(0 + 1, caller_line.indexOf(":"));
    /**
     * line_no - parse out the line number ; remove first `:` char and go to 2nd `:`
     */
    const line_no = caller_line.slice(caller_line.indexOf(":") + 1, caller_line.lastIndexOf(":"));
    /**
     * line_pos - line positional - from the last `:` to the end of the string
     */
    const line_pos = caller_line.slice(caller_line.lastIndexOf(":") + 1);
    const line_num = DEBUG ? `${filename_base}:${line_no}` : HOSTNAME;
    // const line_num = `${filename_base}:${line_no}:${line_pos}`;

    const arr = [convert_to_string(msg)];
    dispVars.forEach((value) => arr.push(convert_to_string(value)));

    const lines = arr.join(" ").split("\n");

    console.log("\x1b[36m%s\x1b[0m", line_num.padStart(PAD, " "), `\x1b[90m| \x1b[36m${lines.shift()}\x1b[0m`);
    while (lines.length > 0) {
        console.log("\x1b[36m%s\x1b[0m", "".padStart(PAD, " "), `\x1b[90m| \x1b[36m${lines.shift()}\x1b[0m`);
    }
}

/**
 * eLog - displays calling line number & message & dumps vars as pretty json string
 * @param {any} msg - string to display in log message
 * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
 * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
 * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
 * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
 */
function success(msg, ...dispVars) {
    /**
     * go one line back for the caller
     * @type {string}
     */
    const eee = new Error();
    let stackLine = eee.stack.split("\n")[2];
    /**
     * retrieve the file basename & positional data, after the last `/` to the `)`
     */
    //
    let caller_line = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
    /**
     *  test for no `/` ; if there is no `/` then use filename without a prefixed path
     */
    if (caller_line.length == 0) {
        caller_line = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
    }
    //
    /**
     * filename_base - parse out the file basename; remove first `/` char and go to `:`
     */
    const filename_base = caller_line.slice(0 + 1, caller_line.indexOf(":"));
    /**
     * line_no - parse out the line number ; remove first `:` char and go to 2nd `:`
     */
    const line_no = caller_line.slice(caller_line.indexOf(":") + 1, caller_line.lastIndexOf(":"));
    /**
     * line_pos - line positional - from the last `:` to the end of the string
     */
    const line_pos = caller_line.slice(caller_line.lastIndexOf(":") + 1);
    const line_num = DEBUG ? `${filename_base}:${line_no}` : HOSTNAME;
    // const line_num = `${filename_base}:${line_no}:${line_pos}`;

    const arr = [convert_to_string(msg)];
    dispVars.forEach((value) => arr.push(convert_to_string(value)));

    const lines = arr.join(" ").split("\n");

    console.log("\x1b[36m%s\x1b[0m", line_num.padStart(PAD, " "), `\x1b[90m| \x1b[32m${lines.shift()}\x1b[0m`);
    while (lines.length > 0) {
        console.log("\x1b[36m%s\x1b[0m", "".padStart(PAD, " "), `\x1b[90m| \x1b[32m${lines.shift()}\x1b[0m`);
    }
}

/**
 * eLog - displays calling line number & message & dumps vars as pretty json string
 * @param {any} msg - string to display in log message
 * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
 * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
 * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
 * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
 */
function warn(msg, ...dispVars) {
    /**
     * go one line back for the caller
     * @type {string}
     */
    const eee = new Error();
    let stackLine = eee.stack.split("\n")[2];
    /**
     * retrieve the file basename & positional data, after the last `/` to the `)`
     */
    //
    let caller_line = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
    /**
     *  test for no `/` ; if there is no `/` then use filename without a prefixed path
     */
    if (caller_line.length == 0) {
        caller_line = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
    }
    //
    /**
     * filename_base - parse out the file basename; remove first `/` char and go to `:`
     */
    const filename_base = caller_line.slice(0 + 1, caller_line.indexOf(":"));
    /**
     * line_no - parse out the line number ; remove first `:` char and go to 2nd `:`
     */
    const line_no = caller_line.slice(caller_line.indexOf(":") + 1, caller_line.lastIndexOf(":"));
    /**
     * line_pos - line positional - from the last `:` to the end of the string
     */
    const line_pos = caller_line.slice(caller_line.lastIndexOf(":") + 1);
    const line_num = DEBUG ? `${filename_base}:${line_no}` : HOSTNAME;
    // const line_num = `${filename_base}:${line_no}:${line_pos}`;

    const arr = [convert_to_string(msg)];
    dispVars.forEach((value) => arr.push(convert_to_string(value)));

    const lines = arr.join(" ").split("\n");

    console.log("\x1b[36m%s\x1b[0m", line_num.padStart(PAD, " "), `\x1b[90m| \x1b[33m${lines.shift()}\x1b[0m`);
    while (lines.length > 0) {
        console.log("\x1b[36m%s\x1b[0m", "".padStart(PAD, " "), `\x1b[90m| \x1b[33m${lines.shift()}\x1b[0m`);
    }
}

/**
 * eLog - displays calling line number & message & dumps vars as pretty json string
 * @param {any} msg - string to display in log message
 * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
 * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
 * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
 * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
 */
function error(msg, ...dispVars) {
    /**
     * go one line back for the caller
     * @type {string}
     */
    const eee = new Error();
    let stackLine = eee.stack.split("\n")[2];
    /**
     * retrieve the file basename & positional data, after the last `/` to the `)`
     */
    //
    let caller_line = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
    /**
     *  test for no `/` ; if there is no `/` then use filename without a prefixed path
     */
    if (caller_line.length == 0) {
        caller_line = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
    }
    //
    /**
     * filename_base - parse out the file basename; remove first `/` char and go to `:`
     */
    const filename_base = caller_line.slice(0 + 1, caller_line.indexOf(":"));
    /**
     * line_no - parse out the line number ; remove first `:` char and go to 2nd `:`
     */
    const line_no = caller_line.slice(caller_line.indexOf(":") + 1, caller_line.lastIndexOf(":"));
    /**
     * line_pos - line positional - from the last `:` to the end of the string
     */
    const line_pos = caller_line.slice(caller_line.lastIndexOf(":") + 1);
    const line_num = DEBUG ? `${filename_base}:${line_no}` : HOSTNAME;
    // const line_num = `${filename_base}:${line_no}:${line_pos}`;

    const arr = [convert_to_string(msg)];
    dispVars.forEach((value) => arr.push(convert_to_string(value)));

    const lines = arr.join(" ").split("\n");

    console.log("\x1b[36m%s\x1b[0m", line_num.padStart(PAD, " "), `\x1b[90m| \x1b[31m${lines.shift()}\x1b[0m`);
    while (lines.length > 0) {
        console.log("\x1b[36m%s\x1b[0m", "".padStart(PAD, " "), `\x1b[90m| \x1b[31m${lines.shift()}\x1b[0m`);
    }
}

/**
 * eLog - displays calling line number & message & dumps vars as pretty json string
 * @param {any} msg - string to display in log message
 * @param {any} dispVars - any number of variables (ellipsis , aka Rest parameters) to dump
 * {@link https://github.com/evanw/node-source-map-support usable by typescript node-source-map-support module}
 * {@link https://github.com/mozilla/source-map/ Mozilla source-map library & project}
 * {@link http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/ good introduction to sourcemaps}
 */
function log(msg, ...dispVars) {
    /**
     * go one line back for the caller
     * @type {string}
     */
    const eee = new Error();
    let stackLine = eee.stack.split("\n")[2];
    /**
     * retrieve the file basename & positional data, after the last `/` to the `)`
     */
    //
    let caller_line = stackLine.slice(stackLine.lastIndexOf("/"), stackLine.lastIndexOf(")"));
    /**
     *  test for no `/` ; if there is no `/` then use filename without a prefixed path
     */
    if (caller_line.length == 0) {
        caller_line = stackLine.slice(stackLine.lastIndexOf("("), stackLine.lastIndexOf(")"));
    }
    //
    /**
     * filename_base - parse out the file basename; remove first `/` char and go to `:`
     */
    const filename_base = caller_line.slice(0 + 1, caller_line.indexOf(":"));
    /**
     * line_no - parse out the line number ; remove first `:` char and go to 2nd `:`
     */
    const line_no = caller_line.slice(caller_line.indexOf(":") + 1, caller_line.lastIndexOf(":"));
    /**
     * line_pos - line positional - from the last `:` to the end of the string
     */
    const line_pos = caller_line.slice(caller_line.lastIndexOf(":") + 1);
    const line_num = DEBUG ? `${filename_base}:${line_no}` : HOSTNAME;
    // const line_num = `${filename_base}:${line_no}:${line_pos}`;

    const arr = [convert_to_string(msg)];
    dispVars.forEach((value) => arr.push(convert_to_string(value)));

    const lines = arr.join(" ").split("\n");

    console.log("\x1b[36m%s\x1b[0m", line_num.padStart(PAD, " "), `\x1b[90m| \x1b[0m${lines.shift()}`);
    while (lines.length > 0) {
        console.log("\x1b[36m%s\x1b[0m", "".padStart(PAD, " "), `\x1b[90m| \x1b[0m${lines.shift()}`);
    }
}

export default {
    info,
    success,
    warn,
    error,
    log,
};
