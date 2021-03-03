import { Subject } from 'rxjs';
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this.unsubscriber$ = new Subject();
    }
    EventHandler.prototype.emit = function (s$, objectToEmit) {
        s$.next(objectToEmit);
    };
    EventHandler.prototype.destroy = function (s$) {
        s$.complete();
        s$ = new Subject();
    };
    EventHandler.prototype.unsubscribeAll = function () {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
        this.unsubscriber$ = new Subject();
    };
    return EventHandler;
}());
export { EventHandler };
//# sourceMappingURL=event-handler.js.map