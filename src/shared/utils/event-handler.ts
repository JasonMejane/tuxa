import { Subject } from 'rxjs';

export abstract class EventHandler {
	public unsubscriber$ = new Subject<void>();

	public emit<T>(s$: Subject<T>, objectToEmit: T): void {
		s$.next(objectToEmit);
	}

	public destroy<T>(s$: Subject<T>): void {
		s$.complete();
		s$ = new Subject<T>();
	}

	public unsubscribeAll(): void {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
		this.unsubscriber$ = new Subject<void>();
	}
}
