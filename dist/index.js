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
import { takeUntil } from 'rxjs/operators';
import { Analyzer } from './analyzer/analyzer';
import { FlowTracker } from './flow-tracker/flow-tracker';
import { Listener } from './listener/listener';
import { Config } from './shared/config/config';
import { EventHandler } from './shared/utils/event-handler';
import { Logger } from './shared/utils/logger';
var Tuxa = /** @class */ (function (_super) {
    __extends(Tuxa, _super);
    /**
     * Create a new Tuxa instance, that will have to be started later
     * Optional config, containing:
     * - mode: The running mode ('DEBUG', 'SILENT' or 'VERBOSE')
     * - custom parameters for behaviors
     * @param config The config for Tuxa
     */
    function Tuxa(config) {
        var _this = _super.call(this) || this;
        _this.behaviors$ = new Subject();
        _this.flowEvents$ = new Subject();
        _this.logger = new Logger();
        _this.mode = 1 /* SILENT */;
        _this.config = config !== null && config !== void 0 ? config : new Config();
        _this.mode = _this.config.mode;
        _this.listener = new Listener(_this.logger, _this.mode);
        _this.analyzer = new Analyzer(_this.config, _this.listener);
        _this.flowTracker = new FlowTracker(_this.listener);
        return _this;
    }
    /**
     * Gets run mode
     * Possible values are DEBUG, SILENT or VERBOSE.
     * Avoid using DEBUG as it is attended for development purposes.
     * SILENT will not log anything.
     * VERBOSE will log found behaviors in the console.
     * @returns The mode Tuxa is actually running
     */
    Tuxa.prototype.getMode = function () {
        return this.mode;
    };
    /**
     * Starts Tuxa
     * Whenever Tuxa is started, it has to be stopped at some point to avoid memory leaks, as it relies on observables
     */
    Tuxa.prototype.start = function () {
        this.listener.startListening();
        this.flowTracker.startTracking();
        this.subscribeToAnalyzer();
        this.subscribeToFlowTracker();
        if (this.mode.valueOf() !== 1 /* SILENT */.valueOf()) {
            this.logger.info(this.config);
        }
    };
    /**
     * Stops Tuxa
     * It will unsubscribe to observables and cancel emitter
     */
    Tuxa.prototype.stop = function () {
        this.unsubscribeAll();
        this.listener.stopListening();
        this.analyzer.stopAnalyzing();
        this.flowTracker.stopTracking();
        this.destroy(this.behaviors$);
        this.destroy(this.flowEvents$);
    };
    Tuxa.prototype.subscribeToAnalyzer = function () {
        var _this = this;
        this.analyzer.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe(function (dE) {
            if (dE.type.valueOf() === 0 /* BEHAVIOR */.valueOf()) {
                _this.emit(_this.behaviors$, dE);
                if (_this.mode.valueOf() !== 1 /* SILENT */.valueOf()) {
                    _this.logger.info(dE.data.name + ' on ' + dE.data.element + ' (' + dE.data.url + ')');
                }
            }
        });
    };
    Tuxa.prototype.subscribeToFlowTracker = function () {
        var _this = this;
        this.flowTracker.events$.pipe(takeUntil(this.unsubscriber$)).subscribe(function (eL) {
            _this.emit(_this.flowEvents$, eL);
            if (_this.mode.valueOf() !== 1 /* SILENT */.valueOf()) {
                _this.logger.info(eL.data.date + ': ' + eL.data.type);
            }
        });
    };
    return Tuxa;
}(EventHandler));
export { Tuxa };
//# sourceMappingURL=index.js.map