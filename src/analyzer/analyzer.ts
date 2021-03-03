import { Observable, Subject, of } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Listener } from '../listener/listener';
import { Config } from '../shared/config/config';
import { Constants } from '../shared/config/constants';
import { DataType } from '../shared/enums/data-type';
import { BehaviorInfo } from '../shared/models/behavior-info.model';
import { BehaviorParameters } from '../shared/models/behavior-parameters.model';
import { DataEmitter } from '../shared/models/data-emitter.model';
import { EventHandler } from '../shared/utils/event-handler';

export class Analyzer extends EventHandler {
	public emitter$ = new Subject<DataEmitter<BehaviorInfo>>();

	private config: Config;
	private eventsCheckingValues = new Map<string, BehaviorParameters>();
	private eventsTimeStampLists = new Map<string, number[]>();
	private isBehaviorDebounceActive = false;
	private listener: Listener;

	constructor(config: Config, listener: Listener) {
		super();

		this.config = config;
		this.listener = listener;
		this.initMaps();
		this.subscribeToListener();
	}

	/**
	 * Stops listening to events, analyzing them, and clean all subscriptions/emitters
	 */
	public stopAnalyzing(): void {
		this.unsubscribeAll();
		this.destroy(this.emitter$);
	}

	private activateBehaviorDebounce(timeRange: number): void {
		this.isBehaviorDebounceActive = true;
		let obs = new Subject();
		obs.pipe(delay(timeRange)).subscribe({
			next: () => this.isBehaviorDebounceActive = false
		});
		obs.next();
		obs.complete();
	}

	private checkBehavior(behavior: string, ev: Event): void {
		const isBehaviorDetected = this.countEventsOfType(behavior, ev);

		if (isBehaviorDetected) {
			this.eventsTimeStampLists.set(behavior, new Array<number>());
			const behaviourInfo = new BehaviorInfo(behavior, ev.target as HTMLElement, new Date(), document.URL);
			this.emit(this.emitter$, new DataEmitter(DataType.BEHAVIOR, behaviourInfo));
		}
	}

	private countEventsOfType(behavior: string, ev: Event): boolean {
		let behaviorDetected = false;
		const eventsArray = this.ensureIsDefined(this.eventsTimeStampLists.get(behavior));

		while (eventsArray.length >= this.eventsCheckingValues.get(behavior)!.threshold) {
			eventsArray.shift();
		}
		eventsArray.push(ev.timeStamp);
		this.eventsTimeStampLists.set(behavior, eventsArray);

		const elapsedTime = eventsArray[this.eventsCheckingValues.get(behavior)!.threshold - 1] - eventsArray[0];
		if (elapsedTime <= this.eventsCheckingValues.get(behavior)!.timeRange) {
			behaviorDetected = true;
		}

		return behaviorDetected;
	}

	private dispatch(ev: Event): void {
		if (!this.isBehaviorDebounceActive) {
			let eventType;

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
	}

	private ensureIsDefined<T>(argument: T | undefined, message: string = 'Undefined.'): T {
		if (argument === undefined) {
			throw new TypeError(message);
		}

		return argument;
	}

	private initMaps(): void {
		this.eventsCheckingValues.set(Constants.CURSOR_TRASHING.name, this.config.cursorTrashingParameters);
		this.eventsCheckingValues.set(Constants.RAGE_CLICK.name, this.config.rageClickParameters);
		this.eventsCheckingValues.set(Constants.RANDOM_SCROLLING.name, this.config.randomScrollingParameters);

		this.eventsTimeStampLists.set(Constants.CURSOR_TRASHING.name, new Array<number>());
		this.eventsTimeStampLists.set(Constants.RAGE_CLICK.name, new Array<number>());
		this.eventsTimeStampLists.set(Constants.RANDOM_SCROLLING.name, new Array<number>());
	}

	private subscribeToListener(): void {
		this.listener.emitter$.pipe(takeUntil(this.unsubscriber$)).subscribe((dE: DataEmitter<Event>) => {
			if (dE.type.valueOf() === DataType.EVENT.valueOf()) {
				this.dispatch(dE.data);
			}
		});
	}
}
