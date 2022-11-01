"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
let $console = window.console;
/**
 * Console 多彩版
 * - 支持chrome浏览器多彩显示,其他浏览器不明确(未测试)
 * - 提供style接口,可自定义样式。
 * - 目前样式只支持 bgcolor: 背景颜色, color: 文字颜色, size:字号
 * - 各接口颜色一览
 *   - log 灰色
 *   - info 绿色
 *   - warn 橘色
 *   - error 红色
 *   - debug 蓝色
 *   - table 紫色
 * @author kevin.chen
 * @email kevin-chen@foxmail.com
 * @date 2022/9/5
 */
class Cscolorify {
    constructor() {
        this.enable = true;
        this.gap = true;
        this.__counts = {};
    }
    /**灰色 */
    log(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x333333, 0xcecece, ['LOG:', ...args]);
    }
    /**绿色 */
    info(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x2C6D1B, 0xCEFDCE, ['INFO:', ...args]);
    }
    /**橘色 */
    warn(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.warn, 0x885200, 0xFDEACE, ['WARN:', ...args]);
    }
    /**蓝色 */
    debug(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.log, 0x09677F, 0xCEEAFD, ['DEBUG:', ...args]);
    }
    /**红色 */
    error(...args) {
        if (!this.enable)
            return;
        this.__outLog($console.error, 0x840505, 0xFDCECE, ['ERROR:', ...args]);
    }
    /**紫色 */
    table(tabularData, properties, ...args) {
        if (!this.enable)
            return;
        this.__outLog($console.group, 0x520088, 0xEBCCFF, [`TABLE: ${args.join(" ")}`]);
        $console.table(tabularData, properties);
        $console.groupEnd();
    }
    /**
     * 断言
     * - 请注意与原生`console.assert`用法不同
     * @param expression 当表达式为true时触发断言
     * @param args
     * @returns
     */
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
        this.__outLog($console.log, 0x09677F, 0xCEEAFD, ['COUNT:', label, value]);
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
    /**
     * 关闭控制台
     * - 用户将无法打开 开发者工具
     * - 该方法适用于发行版本
     */
    disable() {
        this.enable = false;
    }
    /**自定义 */
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
