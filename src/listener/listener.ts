import { fromEvent, Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Constants } from '../shared/config/constants';
import { DataType } from '../shared/enums/data-type';
import { Modes } from '../shared/enums/modes';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';
import { Logger } from '../shared/utils/logger';

export class Listener extends EventHandler {
	public emitter$ = new Subject<DataEmitter<Event>>();

	private events$: Array<Observable<Event>> = [];
	private logger: Logger;
	private mode: Modes;

	constructor(logger: Logger, mode: Modes) {
		super();
		this.logger = logger;
		this.mode = mode;
		this.declareObservables();
	}

	/**
	 * Starts listening to DOM events from the Web API
	 */
	public startListening(): void {
		this.subscribeToEvents();
	}

	/**
	 * Stops listening to events and clean all subscriptions/emitters
	 */
	public stopListening(): void {
		this.unsubscribeAll();
		this.destroy(this.emitter$);
	}

	private declareObservables(): void {
		Object.keys(Constants.TRACKED_EVENTS).forEach((evName) => {
			this.events$.push(fromEvent(document, evName));
		});
	}

	private subscribeToEvents(): void {
		this.events$.forEach((ev$) => {
			ev$.pipe(delay(50), takeUntil(this.unsubscriber$)).subscribe((ev: Event) => {
				if (ev.isTrusted) {
					this.emit(this.emitter$, new DataEmitter(DataType.EVENT, ev));
					if (this.mode.valueOf() === Modes.DEBUG.valueOf()) {
						this.logger.info(ev.timeStamp + ': ' + ev.type);
					}
				}
			});
		});
	}
}
