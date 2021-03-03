export class BehaviorInfo {
	public date: Date;
	public element: HTMLElement | null;
	public name: string;
	public url: string;

	constructor(name: string, element: HTMLElement | null, date: Date, url: string) {
		this.element = element;
		this.name = name;
		this.date = date;
		this.url = url;
	}
}
