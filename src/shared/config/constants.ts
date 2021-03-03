export class Constants {
	public static readonly CURSOR_TRASHING = {
		name: 'Cursor trashing',
		threshold: 150,
		timeRange: 2500,
	};
	public static readonly RAGE_CLICK = {
		name: 'Rage click',
		threshold: 3,
		timeRange: 750,
	};
	public static readonly RANDOM_SCROLLING = {
		name: 'Random scrolling',
		threshold: 40,
		timeRange: 3000,
	};
	public static readonly TRACKED_EVENTS = {
		auxclick: 'auxclick',
		beforeunload: 'beforeunload',
		change: 'change',
		click: 'click',
		dblclick: 'dblclick',
		mousemove: 'mousemove',
		pagehide: 'pagehide',
		scroll: 'scroll',
		submit: 'submit',
		unload: 'unload',
		wheel: 'wheel',
	};
}
