"use strict";
let $console = window.console;
class Cscolorify {
    constructor() {
        this.enable = true;
        this.gap = true;
        this.__counts = {};
    }
    log(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x333333, 0xcecece, ['[LOG]', ...args]);
    }
    info(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x2C6D1B, 0xCEFDCE, ['[INFO]', ...args]);
    }
    warn(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.warn, 0x885200, 0xFDEACE, ['[WARN]', ...args]);
    }
    debug(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x09677F, 0xCEEAFD, ['[DEBUG]', ...args]);
    }
    error(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.error, 0x840505, 0xFDCECE, ['[ERROR]', ...args]);
    }
    table(tabularData, properties, ...args) {
        if (!this.enable)
            return;
        this.__outLog($console.group, 0x520088, 0xEBCCFF, [`[TABLE] ${args.join(" ")}`]);
        $console.table(tabularData, properties);
        $console.groupEnd();
    }
    assert(expression, ...args) {
        if (!this.enable)
            return;
        $console.assert.call($console, typeof expression == "function" ? expression() : expression, ...this.__formatLog(...this.__createLogs(["[ASSERT]", ...args], { color: 0x840505, bgcolor: 0xFDCECE })));
    }
    clear() { $console.clear(); }
    count(label) {
        let key = label ? label : "undefined";
        if (this.__counts[key] === undefined)
            this.__counts[key] = 0;
        let value = ++this.__counts[key];
        this.__outLog($console.log, 0x09677F, 0xCEEAFD, ['[COUNT]', label, value]);
    }
    countReset(label) {
        let key = label ? label : "undefined";
        if (this.__counts[key] === undefined) {
            this.warn(`Count for '${label}' does not exist`);
            return;
        }
        this.__counts[key] = 0;
    }
    dir(item, options) { $console.dir(item, options); }
    dirxml(...data) { $console.dirxml(...data); }
    group(...data) { $console.group(...data); }
    groupCollapsed(...data) { $console.groupCollapsed(...data); }
    groupEnd() { $console.groupEnd(); }
    time(label) { $console.time(label); }
    timeEnd(label) { $console.timeEnd(label); }
    timeLog(label, ...data) { $console.timeLog(label, ...data); }
    timeStamp(label) { $console.timeStamp(label); }
    trace(...data) { $console.trace(...data); }
    disable() {
        this.enable = false;
    }
    style(...args) {
        if (!this.enable)
            return;
        $console.log.apply($console, this.__formatLog(...args));
    }
    __outLog(conosleFunc, textColor, bgColor, args) {
        let texts = [];
        let objects = [];
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (typeof arg == "string") {
                texts.push(arg);
            }
            else {
                objects.push(arg);
            }
        }
        conosleFunc.call($console, ...this.__formatLog(...this.__createLogs(texts, { color: textColor, bgcolor: bgColor })), ...objects);
    }
    __createLogs(text, options) {
        return text.map((v, i) => {
            return Object.assign({ text: v, bold: i == 0 ? true : false }, options);
        });
    }
    __createLog(text, options) {
        options.text = text;
        return options;
    }
    __formatLog(...args) {
        var styles = [];
        var content = "";
        for (var arg of args) {
            if (arg.text.replace(/\n/g, '') == '') {
                content = `${content}${arg.text}`;
                continue;
            }
            if (arg.bgcolor == undefined && arg.color == undefined && arg.size == undefined) {
                content = `${content}${arg.text} `;
                continue;
            }
            content = `${content} %c ${arg.text}${this.gap ? " %c" : ""}`;
            if (arg.bgcolor == undefined) {
                if (arg.color == undefined)
                    arg.color = 0xffffff;
                if (arg.size == undefined)
                    arg.size = 12;
                styles.push(this.textStyle({
                    "font-weight": arg.bold ? "bold" : "normal",
                    "color": this.toHexColor(arg.color),
                    "font-size:": `${arg.size}px`
                }));
            }
            else {
                if (arg.bgcolor == undefined)
                    arg.bgcolor = 0x333333;
                if (arg.color == undefined)
                    arg.color = 0xffffff;
                if (arg.size == undefined)
                    arg.size = 12;
                styles.push(this.textStyle({
                    "font-weight": arg.bold ? "bold" : "normal",
                    "color": this.toHexColor(arg.color),
                    "font-size:": `${arg.size}px`,
                    "padding": "3px 0",
                    "border-radius": "6px;",
                    "background": this.toHexColor(arg.bgcolor)
                }));
            }
            if (this.gap)
                styles.push("");
        }
        styles.unshift(content);
        return styles;
    }
    toHexColor(color) {
        return `#${color.toString(16)}`;
    }
    textStyle(style) {
        return Object.keys(style).map(k => `${k}:${style[k]};`).join("");
    }
}
let colorify = new Cscolorify();
window.console = colorify;
