import {Subject} from 'rxjs';
import {DataType} from '../../../src/shared/enums/data-type';
import {DataEmitter} from '../../../src/shared/models/data-emitter.model';
import {EventHandler} from '../../../src/shared/utils/event-handler';

class MockEventHandlerImpl extends EventHandler {
	public emitter$ = new Subject<DataEmitter<any>>();

	constructor() {
		super();
	}
}

describe('EventHandler', () => {
	let eventHandlerImpl: MockEventHandlerImpl;

	beforeEach(() => {
		eventHandlerImpl = new MockEventHandlerImpl();
	});

	it('should emit when calling emit', () => {
		let objectToEmit = new DataEmitter(DataType.EVENT, {} as Event);

		spyOn<any>(eventHandlerImpl.emitter$, 'next');

		eventHandlerImpl.emit(eventHandlerImpl.emitter$, objectToEmit);

		expect(eventHandlerImpl.emitter$.next).toHaveBeenCalledWith(objectToEmit);
	});

	it('should destroy when calling destroy', () => {
		spyOn<any>(eventHandlerImpl.emitter$, 'complete');

		eventHandlerImpl.destroy(eventHandlerImpl.emitter$);

		expect(eventHandlerImpl.emitter$.complete).toHaveBeenCalled();
	});

	it('should unsubscribe when calling unsubscribeAll', () => {
		spyOn<any>(eventHandlerImpl.unsubscriber$, 'next');
		spyOn<any>(eventHandlerImpl.unsubscriber$, 'complete');

		eventHandlerImpl.unsubscribeAll();
	});
});
