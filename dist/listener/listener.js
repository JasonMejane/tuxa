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
import { fromEvent, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Constants } from '../shared/config/constants';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';
var Listener = /** @class */ (function (_super) {
    __extends(Listener, _super);
    function Listener(logger, mode) {
        var _this = _super.call(this) || this;
        _this.emitter$ = new Subject();
        _this.events$ = [];
        _this.logger = logger;
        _this.mode = mode;
        _this.declareObservables();
        return _this;
    }
    /**
     * Starts listening to DOM events from the Web API
     */
    Listener.prototype.startListening = function () {
        this.subscribeToEvents();
    };
    /**
     * Stops listening to events and clean all subscriptions/emitters
     */
    Listener.prototype.stopListening = function () {
        this.unsubscribeAll();
        this.destroy(this.emitter$);
    };
    Listener.prototype.declareObservables = function () {
        var _this = this;
        Object.keys(Constants.TRACKED_EVENTS).forEach(function (evName) {
            _this.events$.push(fromEvent(document, evName));
        });
    };
    Listener.prototype.subscribeToEvents = function () {
        var _this = this;
        this.events$.forEach(function (ev$) {
            ev$.pipe(delay(50), takeUntil(_this.unsubscriber$)).subscribe(function (ev) {
                if (ev.isTrusted) {
                    _this.emit(_this.emitter$, new DataEmitter(1 /* EVENT */, ev));
                    if (_this.mode.valueOf() === 0 /* DEBUG */.valueOf()) {
                        _this.logger.info(ev.timeStamp + ': ' + ev.type);
                    }
                }
            });
        });
    };
    return Listener;
}(EventHandler));
export { Listener };
//# sourceMappingURL=listener.js.map