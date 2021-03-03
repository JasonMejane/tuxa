import { Subject } from 'rxjs';
import { Listener } from '../listener/listener';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventLog } from '../shared/models/event-log.model';
import { EventHandler } from '../shared/utils/event-handler';
export declare class FlowTracker extends EventHandler {
    events$: Subject<DataEmitter<EventLog>>;
    private listener;
    constructor(listener: Listener);
    startTracking(): void;
    stopTracking(): void;
    private formatEventToEventLog;
    private subscribeToListener;
}
