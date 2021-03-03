import { Tuxa } from '../src';
import { Config } from '../src/shared/config/config';
import { DataType } from '../src/shared/enums/data-type';
import { Modes } from '../src/shared/enums/modes';
import { BehaviorInfo } from '../src/shared/models/behavior-info.model';
import { BehaviorParameters } from '../src/shared/models/behavior-parameters.model';
import { DataEmitter } from '../src/shared/models/data-emitter.model';
import { EventLog } from '../src/shared/models/event-log.model';

describe('Tuxa', () => {
	let tuxa: Tuxa;

	beforeEach(() => {
		tuxa = new Tuxa();
	});

	it('should instanciate', () => {
		expect(tuxa).toBeDefined();
		expect(tuxa['listener']).toBeDefined();
		expect(tuxa['analyzer']).toBeDefined();
		expect(tuxa['flowTracker']).toBeDefined();
	});

	describe('config', () => {
		it('should correctly return the default mode', () => {
			let expectedMode = tuxa.getMode();

			expect(expectedMode.valueOf()).toEqual(Modes.SILENT.valueOf());
		});

		it('should correctly set a custom config', () => {
			let config = new Config(Modes.DEBUG, new BehaviorParameters(10, 1000), new BehaviorParameters(15, 1500), new BehaviorParameters(20, 2000));

			tuxa = new Tuxa(config);

			let expectedMode = tuxa.getMode();
			let expectedCursorTrashingThreshold = tuxa['config'].cursorTrashingParameters.threshold;
			let expectedCursorTrashingTimerange = tuxa['config'].cursorTrashingParameters.timeRange;
			let expectedRageClickThreshold = tuxa['config'].rageClickParameters.threshold;
			let expectedRageClickTimerange = tuxa['config'].rageClickParameters.timeRange;
			let expectedRandomScrollingThreshold = tuxa['config'].randomScrollingParameters.threshold;
			let expectedRandomScrollingTimerange = tuxa['config'].randomScrollingParameters.timeRange;

			expect(expectedMode.valueOf()).toEqual(Modes.DEBUG.valueOf());
			expect(expectedCursorTrashingThreshold).toEqual(10);
			expect(expectedCursorTrashingTimerange).toEqual(1000);
			expect(expectedRageClickThreshold).toEqual(15);
			expect(expectedRageClickTimerange).toEqual(1500);
			expect(expectedRandomScrollingThreshold).toEqual(20);
			expect(expectedRandomScrollingTimerange).toEqual(2000);
		});
	});

	describe('start', () => {
		it('should start everything without calling logger', () => {
			spyOn<any>(tuxa['listener'], 'startListening');
			spyOn<any>(tuxa['flowTracker'], 'startTracking');
			spyOn<any>(tuxa, 'subscribeToAnalyzer');
			spyOn<any>(tuxa, 'subscribeToFlowTracker');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();

			expect(tuxa['listener'].startListening).toHaveBeenCalled();
			expect(tuxa['flowTracker'].startTracking).toHaveBeenCalled();
			expect(tuxa['subscribeToAnalyzer']).toHaveBeenCalled();
			expect(tuxa['subscribeToFlowTracker']).toHaveBeenCalled();
			expect(tuxa['logger'].info).not.toHaveBeenCalled();
		});

		it('should start everything and call the logger', () => {
			let config = new Config(Modes.DEBUG);

			tuxa = new Tuxa(config);

			spyOn<any>(tuxa['listener'], 'startListening');
			spyOn<any>(tuxa['flowTracker'], 'startTracking');
			spyOn<any>(tuxa, 'subscribeToAnalyzer');
			spyOn<any>(tuxa, 'subscribeToFlowTracker');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();

			expect(tuxa['listener'].startListening).toHaveBeenCalled();
			expect(tuxa['flowTracker'].startTracking).toHaveBeenCalled();
			expect(tuxa['subscribeToAnalyzer']).toHaveBeenCalled();
			expect(tuxa['subscribeToFlowTracker']).toHaveBeenCalled();
			expect(tuxa['logger'].info).toHaveBeenCalledWith(config);
		});
	});

	describe('stop', () => {
		it('should stop everything', () => {
			spyOn<any>(tuxa, 'unsubscribeAll');
			spyOn<any>(tuxa['listener'], 'stopListening');
			spyOn<any>(tuxa['analyzer'], 'stopAnalyzing');
			spyOn<any>(tuxa['flowTracker'], 'stopTracking');
			spyOn<any>(tuxa, 'destroy');

			tuxa.stop();

			expect(tuxa['unsubscribeAll']).toHaveBeenCalled();
			expect(tuxa['listener'].stopListening).toHaveBeenCalled();
			expect(tuxa['analyzer'].stopAnalyzing).toHaveBeenCalled();
			expect(tuxa['flowTracker'].stopTracking).toHaveBeenCalled();
			expect(tuxa['destroy']).toHaveBeenCalledWith(tuxa.behaviors$ as any);
			expect(tuxa['destroy']).toHaveBeenCalledWith(tuxa.flowEvents$ as any);
		});
	});

	describe('subscribeToAnalyzer', () => {
		it('should emit when it is a behavior', () => {
			let actualDataEmitter: DataEmitter<BehaviorInfo>;
			let expectedDataEmitter = new DataEmitter(DataType.BEHAVIOR, {} as BehaviorInfo);

			spyOn<any>(tuxa, 'emit');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();
			tuxa.behaviors$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			tuxa['analyzer'].emit(tuxa['analyzer'].emitter$, expectedDataEmitter);

			expect(tuxa['logger'].info).not.toHaveBeenCalled();
			expect(tuxa.emit).toHaveBeenCalledWith(tuxa.behaviors$ as any, expectedDataEmitter);
		});

		it('should log when it is a behavior and not in SILENT mode', () => {
			let config = new Config(Modes.DEBUG);
			tuxa = new Tuxa(config);
			let actualDataEmitter: DataEmitter<BehaviorInfo>;
			let expectedDataEmitter = new DataEmitter(DataType.BEHAVIOR, new BehaviorInfo('test', {} as HTMLElement, new Date(), 'url'));

			spyOn<any>(tuxa, 'emit');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();
			tuxa.behaviors$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			tuxa['analyzer'].emit(tuxa['analyzer'].emitter$, expectedDataEmitter);

			expect(tuxa['logger'].info).toHaveBeenCalledWith(config);
			expect(tuxa.emit).toHaveBeenCalledWith(tuxa.behaviors$ as any, expectedDataEmitter);
			expect(tuxa['logger'].info).toHaveBeenCalledWith('test on [object Object] (url)');
		});

		it('should not emit when it is not a behavior', () => {
			let actualDataEmitter: DataEmitter<BehaviorInfo>;
			let expectedDataEmitter = new DataEmitter(DataType.STATE, {} as BehaviorInfo);

			spyOn<any>(tuxa, 'emit');

			tuxa.start();
			tuxa.behaviors$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			tuxa['analyzer'].emit(tuxa['analyzer'].emitter$, expectedDataEmitter);

			expect(tuxa.emit).not.toHaveBeenCalled();
		});
	});

	describe('subscribeToFlowTracker', () => {
		it('should emit an event', () => {
			let actualDataEmitter: DataEmitter<EventLog>;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT_LOG, {} as EventLog);

			spyOn<any>(tuxa, 'emit');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();
			tuxa.flowEvents$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			tuxa['flowTracker'].emit(tuxa['flowTracker'].events$, expectedDataEmitter);

			expect(tuxa['logger'].info).not.toHaveBeenCalled();
			expect(tuxa.emit).toHaveBeenCalledWith(tuxa.flowEvents$ as any, expectedDataEmitter);
		});

		it('should emit an event and use the logger', () => {
			let config = new Config(Modes.DEBUG);
			tuxa = new Tuxa(config);
			let actualDataEmitter: DataEmitter<EventLog>;
			let date = new Date();
			let expectedDataEmitter = new DataEmitter(
				DataType.EVENT_LOG,
				new EventLog(date, {} as HTMLElement, 'click', 'url')
				);

			spyOn<any>(tuxa, 'emit');
			spyOn<any>(tuxa['logger'], 'info');

			tuxa.start();
			tuxa.flowEvents$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			tuxa['flowTracker'].emit(tuxa['flowTracker'].events$, expectedDataEmitter);

			expect(tuxa['logger'].info).toHaveBeenCalledWith(config);
			expect(tuxa.emit).toHaveBeenCalledWith(tuxa.flowEvents$ as any, expectedDataEmitter);
			expect(tuxa['logger'].info).toHaveBeenCalledWith(date + ': click');
		});
	});
});
