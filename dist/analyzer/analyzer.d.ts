import { Subject } from 'rxjs';
import { Listener } from '../listener/listener';
import { Config } from '../shared/config/config';
import { BehaviorInfo } from '../shared/models/behavior-info.model';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';
export declare class Analyzer extends EventHandler {
    emitter$: Subject<DataEmitter<BehaviorInfo>>;
    private config;
    private eventsCheckingValues;
    private eventsTimeStampLists;
    private isBehaviorDebounceActive;
    private listener;
    constructor(config: Config, listener: Listener);
    /**
     * Stops listening to events, analyzing them, and clean all subscriptions/emitters
     */
    stopAnalyzing(): void;
    private activateBehaviorDebounce;
    private checkBehavior;
    private countEventsOfType;
    private dispatch;
    private ensureIsDefined;
    private initMaps;
    private subscribeToListener;
}
