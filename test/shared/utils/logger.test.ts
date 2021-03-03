import { Logger } from '../../../src/shared/utils/logger';

describe('Logger', () => {
	let logger: Logger;

	beforeEach(() => {
		logger = new Logger();
	});

	it('should log an error when calling error', () => {
		let message = 'message';

		spyOn<any>(console, 'error');

		logger.error(message);

		expect(console.error).toHaveBeenCalledWith(message);
	});

	it('should log an info when calling info', () => {
		let message = {msg: 'message'};

		spyOn<any>(console, 'info');

		logger.info(message);

		expect(console.info).toHaveBeenCalledWith(message);
	});

	it('should log a warn when calling warn', () => {
		let message = 'message';

		spyOn<any>(console, 'warn');

		logger.warn(message);

		expect(console.warn).toHaveBeenCalledWith(message);
	});
});
