export class Logger {
	public error<T>(msg: T): void {
		console.error(msg);
	}

	public info<T>(msg: T): void {
		console.info(msg);
	}

	public warn<T>(msg: T): void {
		console.warn(msg);
	}
}
