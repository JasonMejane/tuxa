import { Subject } from 'rxjs';
export declare abstract class EventHandler {
    unsubscriber$: Subject<void>;
    emit<T>(s$: Subject<T>, objectToEmit: T): void;
    destroy<T>(s$: Subject<T>): void;
    unsubscribeAll(): void;
}
