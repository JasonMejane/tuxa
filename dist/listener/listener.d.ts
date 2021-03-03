import { Subject } from 'rxjs';
import { Modes } from '../shared/enums/modes';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';
import { Logger } from '../shared/utils/logger';
export declare class Listener extends EventHandler {
    emitter$: Subject<DataEmitter<Event>>;
    private events$;
    private logger;
    private mode;
    constructor(logger: Logger, mode: Modes);
    /**
     * Starts listening to DOM events from the Web API
     */
    startListening(): void;
    /**
     * Stops listening to events and clean all subscriptions/emitters
     */
    stopListening(): void;
    private declareObservables;
    private subscribeToEvents;
}
