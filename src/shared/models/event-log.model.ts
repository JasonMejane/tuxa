export class EventLog {
	public date: Date;
	public element: HTMLElement | null;
	public type: string;
	public url: string;

	constructor(date: Date, element: HTMLElement | null, type: string, url: string) {
		this.date = date;
		this.element = element;
		this.type = type;
		this.url = url;
	}
}
