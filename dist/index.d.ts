import { Subject } from 'rxjs';
import { Config } from './shared/config/config';
import { Modes } from './shared/enums/modes';
import { BehaviorInfo } from './shared/models/behavior-info.model';
import { DataEmitter } from './shared/models/data-emitter.model';
import { EventLog } from './shared/models/event-log.model';
import { EventHandler } from './shared/utils/event-handler';
export declare class Tuxa extends EventHandler {
    behaviors$: Subject<DataEmitter<BehaviorInfo>>;
    flowEvents$: Subject<DataEmitter<EventLog>>;
    private analyzer;
    private config;
    private flowTracker;
    private listener;
    private logger;
    private mode;
    /**
     * Create a new Tuxa instance, that will have to be started later
     * Optional config, containing:
     * - mode: The running mode ('DEBUG', 'SILENT' or 'VERBOSE')
     * - custom parameters for behaviors
     * @param config The config for Tuxa
     */
    constructor(config?: Config);
    /**
     * Gets run mode
     * Possible values are DEBUG, SILENT or VERBOSE.
     * Avoid using DEBUG as it is attended for development purposes.
     * SILENT will not log anything.
     * VERBOSE will log found behaviors in the console.
     * @returns The mode Tuxa is actually running
     */
    getMode(): Modes;
    /**
     * Starts Tuxa
     * Whenever Tuxa is started, it has to be stopped at some point to avoid memory leaks, as it relies on observables
     */
    start(): void;
    /**
     * Stops Tuxa
     * It will unsubscribe to observables and cancel emitter
     */
    stop(): void;
    private subscribeToAnalyzer;
    private subscribeToFlowTracker;
}
