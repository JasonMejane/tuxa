import { FlowTracker } from '../../src/flow-tracker/flow-tracker';
import { Listener } from '../../src/listener/listener';
import { Constants } from '../../src/shared/config/constants';
import { DataType } from '../../src/shared/enums/data-type';
import { Modes } from '../../src/shared/enums/modes';
import { DataEmitter } from '../../src/shared/models/data-emitter.model';
import { EventLog } from '../../src/shared/models/event-log.model';
import { Logger } from '../../src/shared/utils/logger';

describe('FlowTracker', () => {
	let flowTracker: FlowTracker;
	let logger = new Logger();
	let mode = Modes.SILENT;
	let listener = new Listener(logger, mode);

	beforeEach(() => {
		flowTracker = new FlowTracker(listener);
	});

	it('should instanciate', () => {
		expect(flowTracker).toBeDefined();
	});

	describe('startTracking', () => {
		it('should correctly start tracking', () => {
			spyOn<any>(flowTracker, 'subscribeToListener');

			flowTracker.startTracking();

			expect(flowTracker['subscribeToListener']).toHaveBeenCalled();
		});
	});

	describe('stopTracking', () => {
		it('should correctly stop tracking', () => {
			spyOn<any>(flowTracker, 'unsubscribeAll');
			spyOn<any>(flowTracker, 'destroy');

			flowTracker.stopTracking();

			expect(flowTracker['unsubscribeAll']).toHaveBeenCalled();
			expect(flowTracker['destroy']).toHaveBeenCalledWith(flowTracker.events$ as any);
		});
	});

	describe('formatEventToEventLog', () => {
		it('should return a proper EventLog', () => {
			let date = new Date();
			let event: Event = ({ type: 'click', target: {} as HTMLElement } as unknown) as Event;
			let expectedEventLog = new EventLog(date, {} as HTMLElement, 'click', 'http://localhost:9876/context.html');

			let actualEventLog = flowTracker['formatEventToEventLog'](date, event);

			expect(actualEventLog).toEqual(expectedEventLog);
		});
	});

	describe('subscribeToListener', () => {
		it('should not emit if it is not an event', () => {
			let actualDataEmitter: DataEmitter<EventLog>;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT_LOG, {} as Event);

			spyOn<any>(flowTracker, 'emit');

			flowTracker['subscribeToListener']();
			flowTracker.events$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			flowTracker['listener'].emit(flowTracker['listener'].emitter$, expectedDataEmitter);

			expect(flowTracker.emit).not.toHaveBeenCalled();
		});

		it('should not emit if it is a mousemove event', () => {
			let actualDataEmitter: DataEmitter<EventLog>;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT, { type: 'mousemove' } as Event);

			spyOn<any>(flowTracker, 'emit');

			flowTracker['subscribeToListener']();
			flowTracker.events$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			flowTracker['listener'].emit(flowTracker['listener'].emitter$, expectedDataEmitter);

			expect(flowTracker.emit).not.toHaveBeenCalled();
		});

		it('should emit if it is an event', () => {
			let actualDataEmitter: DataEmitter<EventLog>;
			let date = new Date();
			let event: Event = ({ type: Constants.TRACKED_EVENTS.click, target: {} as HTMLElement } as unknown) as Event;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT, event);
			let expectedEventLog = new EventLog(date, {} as HTMLElement, Constants.TRACKED_EVENTS.click, 'http://localhost:9876/context.html');

			spyOn<any>(flowTracker, 'emit');
			spyOn<any>(flowTracker, 'formatEventToEventLog').and.returnValue(expectedEventLog);

			flowTracker['subscribeToListener']();
			flowTracker.events$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			flowTracker['listener'].emit(flowTracker['listener'].emitter$, expectedDataEmitter);

			expect(flowTracker.emit).toHaveBeenCalled();
		});
	});
});
