import { Analyzer } from '../../src/analyzer/analyzer';
import {Listener} from '../../src/listener/listener';
import {Config} from '../../src/shared/config/config';
import {Constants} from '../../src/shared/config/constants';
import {DataType} from '../../src/shared/enums/data-type';
import {Modes} from '../../src/shared/enums/modes';
import {BehaviorInfo} from '../../src/shared/models/behavior-info.model';
import {DataEmitter} from '../../src/shared/models/data-emitter.model';
import {Logger} from '../../src/shared/utils/logger';

describe('Analyzer', () => {
	let analyzer: Analyzer;
	let config = new Config();
	let listener: Listener;
	let logger = new Logger();
	let mode = Modes.SILENT;

	beforeEach(() => {
		listener = new Listener(logger, mode);
		analyzer = new Analyzer(config, listener);
	});

	it('should instanciate', () => {
		analyzer = new Analyzer(config, listener);

		expect(analyzer).toBeDefined();
		expect(analyzer['config']).toBeDefined();
		expect(analyzer['listener']).toBeDefined();
	});

	describe('stopAnalyzing', () => {
		it('should correctly stop analyzing', () => {
			spyOn<any>(analyzer, 'unsubscribeAll');
			spyOn<any>(analyzer, 'destroy');

			analyzer.stopAnalyzing();

			expect(analyzer['unsubscribeAll']).toHaveBeenCalled();
			expect(analyzer['destroy']).toHaveBeenCalledWith(analyzer.emitter$ as any);
		});
	});

	describe('activateBehaviorDebounce', () => {
		it('should set the correct timeout', async() => {
			let timeRange = 50;

			analyzer['activateBehaviorDebounce'](timeRange);

			expect(analyzer['isBehaviorDebounceActive']).toBeTrue();
			await setTimeout(() => {
				expect(analyzer['isBehaviorDebounceActive']).toBeFalse();
			}, timeRange);
		});
	});

	describe('checkBehavior', () => {
		it('should only count events when the threshold is not reached', () => {
			let event: Event = ({ type: Constants.TRACKED_EVENTS.click, target: {} as HTMLElement } as unknown) as Event;

			spyOn<any>(analyzer, 'countEventsOfType').and.returnValue(false);
			spyOn<any>(analyzer, 'emit');

			analyzer['checkBehavior'](Constants.CURSOR_TRASHING.name, event);

			expect(analyzer['countEventsOfType']).toHaveBeenCalledWith(Constants.CURSOR_TRASHING.name, event);
			expect(analyzer['emit']).not.toHaveBeenCalled();
		});

		it('should make actions when the threshold is reached', () => {
			let event: Event = ({ type: Constants.TRACKED_EVENTS.click, target: {} as HTMLElement } as unknown) as Event;

			spyOn<any>(analyzer, 'countEventsOfType').and.returnValue(true);
			spyOn<any>(analyzer['eventsTimeStampLists'], 'set');
			spyOn<any>(analyzer, 'emit');

			analyzer['checkBehavior'](Constants.CURSOR_TRASHING.name, event);

			expect(analyzer['countEventsOfType']).toHaveBeenCalledWith(Constants.CURSOR_TRASHING.name, event);
			expect(analyzer['eventsTimeStampLists'].set).toHaveBeenCalledWith(Constants.CURSOR_TRASHING.name, new Array<number>());
			expect(analyzer['emit']).toHaveBeenCalled();
		});
	});

	describe('countEventsOfType', () => {
		it('should return false when behavior is not detected', () => {
			let actualBehaviorDetection = analyzer['countEventsOfType'](Constants.CURSOR_TRASHING.name, {timeStamp: 20} as Event);

			expect(actualBehaviorDetection).toBeFalse();
		});

		it('should return true when behavior is detected', () => {
			let array = new Array<number>();
			for (let index = 0; index < Constants.CURSOR_TRASHING.threshold * 2 + 1; index++) {
				array.push(index * Constants.CURSOR_TRASHING.timeRange / Constants.CURSOR_TRASHING.threshold);
			}

			analyzer['eventsTimeStampLists'].set(Constants.CURSOR_TRASHING.name, array);
			let actualBehaviorDetection = analyzer['countEventsOfType'](Constants.CURSOR_TRASHING.name, {timeStamp: 2 * Constants.CURSOR_TRASHING.timeRange + 10} as Event);

			expect(actualBehaviorDetection).toBeTrue();
		});
	});

	describe('dispatch', () => {
		it('should not do anything when isBehaviorDebounceActive is true', () => {
			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = true;
			analyzer['dispatch']({} as Event);

			expect(analyzer['checkBehavior']).not.toHaveBeenCalled();
		});

		it('should not do call checkBehavior when event type is not handled', () => {
			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = false;
			analyzer['dispatch']({type: 'test'} as Event);

			expect(analyzer['checkBehavior']).not.toHaveBeenCalled();
		});

		it('should check cursor trashing when it is a mousemove event', () => {
			let event = {type: Constants.TRACKED_EVENTS.mousemove} as Event;

			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = false;
			analyzer['dispatch'](event);

			expect(analyzer['checkBehavior']).toHaveBeenCalledWith(Constants.CURSOR_TRASHING.name, event);
		});

		it('should check rage click when it is a click event', () => {
			let event = {type: Constants.TRACKED_EVENTS.click} as Event;

			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = false;
			analyzer['dispatch'](event);

			expect(analyzer['checkBehavior']).toHaveBeenCalledWith(Constants.RAGE_CLICK.name, event);
		});

		it('should check rage click when it is a auxiliary click event', () => {
			let event = {type: Constants.TRACKED_EVENTS.auxclick} as Event;

			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = false;
			analyzer['dispatch'](event);

			expect(analyzer['checkBehavior']).toHaveBeenCalledWith(Constants.RAGE_CLICK.name, event);
		});

		it('should check random scrolling when it is a wheel event', () => {
			let event = {type: Constants.TRACKED_EVENTS.wheel} as Event;

			spyOn<any>(analyzer, 'checkBehavior');

			analyzer['isBehaviorDebounceActive'] = false;
			analyzer['dispatch'](event);

			expect(analyzer['checkBehavior']).toHaveBeenCalledWith(Constants.RANDOM_SCROLLING.name, event);
		});
	});

	describe('ensureIsDefined', () => {
		it('should return the argument when defined', () => {
			let argument = 'test';

			let expectedArgument = analyzer['ensureIsDefined'](argument, 'test');

			expect(expectedArgument).toEqual(argument);
		});

		it('should throw an error when argument is undefined', () => {
			expect(function(){ analyzer['ensureIsDefined'](undefined) }).toThrow(new TypeError('Undefined.'));
		});
	});

	describe('initMap', () => {
		it('should correctly initialize maps', () => {
			expect(analyzer['eventsCheckingValues'].size).toEqual(3);
			expect(analyzer['eventsCheckingValues'].has(Constants.CURSOR_TRASHING.name)).toBeTrue;
			expect(analyzer['eventsTimeStampLists'].size).toEqual(3);
			expect(analyzer['eventsTimeStampLists'].has(Constants.RANDOM_SCROLLING.name)).toBeTrue;
		});
	});

	describe('subscribeToListener', () => {
		it('should not emit if it is not an event', () => {
			let actualDataEmitter: DataEmitter<BehaviorInfo>;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT_LOG, {} as Event);

			spyOn<any>(analyzer, 'dispatch');

			analyzer['subscribeToListener']();
			analyzer.emitter$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			analyzer['listener'].emit(analyzer['listener'].emitter$, expectedDataEmitter);

			expect(analyzer['dispatch']).not.toHaveBeenCalled();
		});

		it('should emit if it is an event', () => {
			let actualDataEmitter: DataEmitter<BehaviorInfo>;
			let event: Event = ({ type: Constants.TRACKED_EVENTS.click, target: {} as HTMLElement } as unknown) as Event;
			let expectedDataEmitter = new DataEmitter(DataType.EVENT, event);

			spyOn<any>(analyzer, 'dispatch');

			analyzer['subscribeToListener']();
			analyzer.emitter$.subscribe((dE) => {
				actualDataEmitter = dE;
			});
			analyzer['listener'].emit(analyzer['listener'].emitter$, expectedDataEmitter);

			expect(analyzer['dispatch']).toHaveBeenCalledWith(event);
		});
	});
});
