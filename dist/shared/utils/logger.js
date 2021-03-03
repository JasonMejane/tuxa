var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.error = function (msg) {
        console.error(msg);
    };
    Logger.prototype.info = function (msg) {
        console.info(msg);
    };
    Logger.prototype.warn = function (msg) {
        console.warn(msg);
    };
    return Logger;
}());
export { Logger };
//# sourceMappingURL=logger.js.map