import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Listener } from '../listener/listener';
import { Constants } from '../shared/config/constants';
import { DataType } from '../shared/enums/data-type';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventLog } from '../shared/models/event-log.model';
import { EventHandler } from '../shared/utils/event-handler';

export class FlowTracker extends EventHandler {
	public events$ = new Subject<DataEmitter<EventLog>>();

	private listener: Listener;

	constructor(listener: Listener) {
		super();

		this.listener = listener;
	}

	public startTracking(): void {
		this.subscribeToListener();
	}

	public stopTracking(): void {
		this.unsubscribeAll();
		this.destroy(this.events$);
	}

	private formatEventToEventLog(date: Date, ev: Event): EventLog {
		return new EventLog(date, ev.target as HTMLElement, ev.type, document.URL);
	}

	private subscribeToListener(): void {
		this.listener.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe((dE: DataEmitter<Event>) => {
			if (dE.type.valueOf() === DataType.EVENT.valueOf() && dE.data.type !== Constants.TRACKED_EVENTS.mousemove) {
				this.emit(this.events$, new DataEmitter(DataType.EVENT_LOG, this.formatEventToEventLog(new Date(), dE.data)));
			}
		});
	}
}
