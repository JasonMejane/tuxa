import { Listener } from '../../src/listener/listener';
import { Constants } from '../../src/shared/config/constants';
import { Modes } from '../../src/shared/enums/modes';
import { DataEmitter } from '../../src/shared/models/data-emitter.model';
import { Logger } from '../../src/shared/utils/logger';

describe('Listener', () => {
	let listener: Listener;
	let logger = new Logger();
	let mode = Modes.SILENT;

	beforeEach(() => {
		listener = new Listener(logger, mode);
	});

	it('should instanciate', () => {
		expect(listener).toBeDefined();
	});

	describe('startListening', () => {
		it('should correctly start listening', () => {
			spyOn<any>(listener, 'subscribeToEvents');

			listener.startListening();

			expect(listener['subscribeToEvents']).toHaveBeenCalled();
		});
	});

	describe('stopListening', () => {
		it('should correctly stop listening', () => {
			spyOn<any>(listener, 'unsubscribeAll');
			spyOn<any>(listener, 'destroy');

			listener.stopListening();

			expect(listener['unsubscribeAll']).toHaveBeenCalled();
			expect(listener['destroy']).toHaveBeenCalledWith(listener.emitter$ as any);
		});
	});

	describe('declareObservables', () => {
		it('should declare the array of observables', () => {
			let arrayLength = Object.keys(Constants.TRACKED_EVENTS).length;

			listener['declareObservables'];

			expect(listener['events$'].length).toEqual(arrayLength);
		});
	});

	describe('subscribeToEvents', () => {
		it('should not emit if it is not a trusted event', () => {
			spyOn<any>(listener, 'emit');

			listener['subscribeToEvents']();
			document.body.click();

			expect(listener.emit).not.toHaveBeenCalled();
		});
	});
});
