var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Constants } from '../shared/config/constants';
import { BehaviorInfo } from '../shared/models/behavior-info.model';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';
var Analyzer = /** @class */ (function (_super) {
    __extends(Analyzer, _super);
    function Analyzer(config, listener) {
        var _this = _super.call(this) || this;
        _this.emitter$ = new Subject();
        _this.eventsCheckingValues = new Map();
        _this.eventsTimeStampLists = new Map();
        _this.isBehaviorDebounceActive = false;
        _this.config = config;
        _this.listener = listener;
        _this.initMaps();
        _this.subscribeToListener();
        return _this;
    }
    /**
     * Stops listening to events, analyzing them, and clean all subscriptions/emitters
     */
    Analyzer.prototype.stopAnalyzing = function () {
        this.unsubscribeAll();
        this.destroy(this.emitter$);
    };
    Analyzer.prototype.activateBehaviorDebounce = function (timeRange) {
        var _this = this;
        this.isBehaviorDebounceActive = true;
        var obs = new Subject();
        obs.pipe(delay(timeRange)).subscribe({
            next: function () { return _this.isBehaviorDebounceActive = false; }
        });
        obs.next();
        obs.complete();
    };
    Analyzer.prototype.checkBehavior = function (behavior, ev) {
        var isBehaviorDetected = this.countEventsOfType(behavior, ev);
        if (isBehaviorDetected) {
            this.eventsTimeStampLists.set(behavior, new Array());
            var behaviourInfo = new BehaviorInfo(behavior, ev.target, new Date(), document.URL);
            this.emit(this.emitter$, new DataEmitter(0 /* BEHAVIOR */, behaviourInfo));
        }
    };
    Analyzer.prototype.countEventsOfType = function (behavior, ev) {
        var behaviorDetected = false;
        var eventsArray = this.ensureIsDefined(this.eventsTimeStampLists.get(behavior));
        while (eventsArray.length >= this.eventsCheckingValues.get(behavior).threshold) {
            eventsArray.shift();
        }
        eventsArray.push(ev.timeStamp);
        this.eventsTimeStampLists.set(behavior, eventsArray);
        var elapsedTime = eventsArray[this.eventsCheckingValues.get(behavior).threshold - 1] - eventsArray[0];
        if (elapsedTime <= this.eventsCheckingValues.get(behavior).timeRange) {
            behaviorDetected = true;
        }
        return behaviorDetected;
    };
    Analyzer.prototype.dispatch = function (ev) {
        if (!this.isBehaviorDebounceActive) {
            var eventType = void 0;
            switch (ev.type) {
                case Constants.TRACKED_EVENTS.mousemove:
                    eventType = Constants.CURSOR_TRASHING.name;
                    break;
                case Constants.TRACKED_EVENTS.click:
                    eventType = Constants.RAGE_CLICK.name;
                    break;
                case Constants.TRACKED_EVENTS.auxclick:
                    eventType = Constants.RAGE_CLICK.name;
                    break;
                case Constants.TRACKED_EVENTS.wheel:
                    eventType = Constants.RANDOM_SCROLLING.name;
                    break;
            }
            if (eventType) {
                this.checkBehavior(eventType, ev);
            }
        }
    };
    Analyzer.prototype.ensureIsDefined = function (argument, message) {
        if (message === void 0) { message = 'Undefined.'; }
        if (argument === undefined) {
            throw new TypeError(message);
        }
        return argument;
    };
    Analyzer.prototype.initMaps = function () {
        this.eventsCheckingValues.set(Constants.CURSOR_TRASHING.name, this.config.cursorTrashingParameters);
        this.eventsCheckingValues.set(Constants.RAGE_CLICK.name, this.config.rageClickParameters);
        this.eventsCheckingValues.set(Constants.RANDOM_SCROLLING.name, this.config.randomScrollingParameters);
        this.eventsTimeStampLists.set(Constants.CURSOR_TRASHING.name, new Array());
        this.eventsTimeStampLists.set(Constants.RAGE_CLICK.name, new Array());
        this.eventsTimeStampLists.set(Constants.RANDOM_SCROLLING.name, new Array());
    };
    Analyzer.prototype.subscribeToListener = function () {
        var _this = this;
        this.listener.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe(function (dE) {
            if (dE.type.valueOf() === 1 /* EVENT */.valueOf()) {
                _this.dispatch(dE.data);
            }
        });
    };
    return Analyzer;
}(EventHandler));
export { Analyzer };
//# sourceMappingURL=analyzer.js.map