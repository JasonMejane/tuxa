var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from '../shared/config/constants';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventLog } from '../shared/models/event-log.model';
import { EventHandler } from '../shared/utils/event-handler';
var FlowTracker = /** @class */ (function (_super) {
    __extends(FlowTracker, _super);
    function FlowTracker(listener) {
        var _this = _super.call(this) || this;
        _this.events$ = new Subject();
        _this.listener = listener;
        return _this;
    }
    FlowTracker.prototype.startTracking = function () {
        this.subscribeToListener();
    };
    FlowTracker.prototype.stopTracking = function () {
        this.unsubscribeAll();
        this.destroy(this.events$);
    };
    FlowTracker.prototype.formatEventToEventLog = function (date, ev) {
        return new EventLog(date, ev.target, ev.type, document.URL);
    };
    FlowTracker.prototype.subscribeToListener = function () {
        var _this = this;
        this.listener.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe(function (dE) {
            if (dE.type.valueOf() === 1 /* EVENT */.valueOf() && dE.data.type !== Constants.TRACKED_EVENTS.mousemove) {
                _this.emit(_this.events$, new DataEmitter(2 /* EVENT_LOG */, _this.formatEventToEventLog(new Date(), dE.data)));
            }
        });
    };
    return FlowTracker;
}(EventHandler));
export { FlowTracker };
//# sourceMappingURL=flow-tracker.js.map