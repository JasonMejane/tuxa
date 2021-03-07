# Tuxa

<p style="text-align: center;">
	<b>The UX Analyzer, your toolbox to help you analyze User Experience of your app.</b>
	<br/>
	<br/>
	<br/>
	<span>
		<img src="https://img.shields.io/github/v/release/JasonMejane/tuxa" alt="Release" />
	</span>&nbsp;
	<a href="https://www.npmjs.com/tuxa">
    	<img src="https://img.shields.io/npm/v/tuxa.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="Tuxa on npm" />
	</a>&nbsp;
	<span>
		<img src="https://img.shields.io/bundlephobia/min/tuxa" alt="Package size" />
	</span>&nbsp;
	<span>
		<img src="https://img.shields.io/github/license/JasonMejane/tuxa" alt="Licence" />
	</span>
	<br/>
	<br/>
	<span>
		<img src="https://github.com/JasonMejane/tuxa/actions/workflows/nodejs_master.yml/badge.svg" alt="Node.js CI" />
	</span>&nbsp;
	<span>
		<img src="https://img.shields.io/badge/coverage-98%25-success" alt="Coverage" />
	</span>&nbsp;
	<span>
		<img src="https://img.shields.io/david/JasonMejane/tuxa" alt="Dependencies" />
	</span>&nbsp;
	<span>
		<img src="https://img.shields.io/github/issues/JasonMejane/tuxa" alt="Issues" />
	</span>&nbsp;
</p>

## Installation 
```sh
npm install tuxa --save
yarn add tuxa
bower install tuxa --save
```

## Usage

One instance of Tuxa has to be created, started and used across your application. The data is provided through two observables:
you just need to subscribe to `behaviors$` to get the detected behaviors like rage clicks, and `flowEvents$` to get all events (all but mousemove) in order to track user actions in a particular flow.

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

### Github repo
https://github.com/JasonMejane/tuxa-demo-app

### Stackblitz demo
https://stackblitz.com/edit/tuxa-demo-app
