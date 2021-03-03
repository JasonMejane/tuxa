var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.CURSOR_TRASHING = {
        name: 'Cursor trashing',
        threshold: 150,
        timeRange: 2500,
    };
    Constants.RAGE_CLICK = {
        name: 'Rage click',
        threshold: 3,
        timeRange: 750,
    };
    Constants.RANDOM_SCROLLING = {
        name: 'Random scrolling',
        threshold: 40,
        timeRange: 3000,
    };
    Constants.TRACKED_EVENTS = {
        auxclick: 'auxclick',
        beforeunload: 'beforeunload',
        change: 'change',
        click: 'click',
        dblclick: 'dblclick',
        mousemove: 'mousemove',
        pagehide: 'pagehide',
        scroll: 'scroll',
        submit: 'submit',
        unload: 'unload',
        wheel: 'wheel',
    };
    return Constants;
}());
export { Constants };
//# sourceMappingURL=constants.js.map