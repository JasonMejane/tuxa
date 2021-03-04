# Tuxa
The UX Analyzer, your toolbox to help you analyze User Experience of your app.

## Installation 
```sh
npm install tuxa --save
yarn add tuxa
bower install tuxa --save
```

## Usage

### In an Angular app, make a service provided in root
```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Tuxa } from 'tuxa';
import { takeUntil } from 'rxjs/operators';
import { Config } from 'tuxa/dist/shared/config/config';
import { DataEmitter } from 'tuxa/dist/shared/models/data-emitter.model';
import { EventLog } from 'tuxa/dist/shared/models/event-log.model';
import { BehaviorInfo } from 'tuxa/dist/shared/models/behavior-info.model';

@Injectable({
	providedIn: 'root',
})
export class TuxaService {
	public behaviors$ = new Subject<DataEmitter<BehaviorInfo>>();
	public flowEvents$ = new Subject<DataEmitter<EventLog>>();

	private tuxa: Tuxa;
	private config = new Config();
	private unsubscriber$ = new Subject<void>();
	private flowUnsubscriber$ = new Subject<void>();

	constructor() {
		this.tuxa = new Tuxa(this.config);
		this.tuxa.start();
		this.subscribeToTuxa();
	}

	public stop(): void {
		this.destroy(this.behaviors$);
		this.destroy(this.flowEvents$);
		this.unsubscriber$.next();
		this.destroy(this.unsubscriber$);
		this.flowUnsubscriber$.next();
		this.destroy(this.flowUnsubscriber$);
		this.tuxa.stop();
	}

	private destroy<T>(s$: Subject<T>): void {
		s$.complete();
		s$ = new Subject<T>();
	}

	private emit<T>(s$: Subject<T>, data: T): void {
		s$.next(data);
	}

	private subscribeToTuxa(): void {
		this.tuxa.behaviors$
			.pipe(takeUntil(this.unsubscriber$))
			.subscribe((dE: DataEmitter<BehaviorInfo>) => {
				this.emit(this.behaviors$, dE);
			});
		this.tuxa.flowEvents$
			.pipe(takeUntil(this.flowUnsubscriber$))
			.subscribe((eL: DataEmitter<EventLog>) => {
				this.emit(this.flowEvents$, eL);
			});
	}
}
```
Note that all the observables have to be unsubscribe in order to avoid memory leaks.

This way, you just need to subscribe to `behaviors$` to get the detected behaviors like rage clicks, and `flowEvents$` to get all events (all but mousemove) in order to track user actions in a particular flow.

### Configuration
You can use the default configuration, or you can customize it. The default configuration is:
```typescript
cursorTrashingParameters:
	threshold: 150
	timeRange: 2500

rageClickParameters:
	threshold: 3
	timeRange: 750

randomScrollingParameters:
	threshold: 40
	timeRange: 3000

mode: SILENT
```
Threshold represents the number of occurences of a given event to be detected as one of those three behaviors: cursor trashing, rage click and random scrolling.
Time range represents the range during which at least the threshold number of occurences happens.


## Tuxa Demo App

https://github.com/JasonMejane/tuxa-demo-app
