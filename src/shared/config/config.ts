import { CursorTrashingParameters } from '../models/cursor-trashing-parameters';
import { RageClickParameters } from '../models/rage-click-parameters';
import { RandomScrollingParameters } from '../models/random-scrolling-parameters';
import { BehaviorParameters } from '../models/behavior-parameters.model';
import { Modes } from '../enums/modes';

export class Config {
	public cursorTrashingParameters: CursorTrashingParameters;
	public rageClickParameters: RageClickParameters;
	public randomScrollingParameters: RandomScrollingParameters;
	public mode: Modes;

	constructor(
		mode?: Modes,
		cursorTrashingParameters?: BehaviorParameters,
		rageClickParameters?: BehaviorParameters,
		randomScrollingParameters?: BehaviorParameters
	) {
		this.cursorTrashingParameters = cursorTrashingParameters ?? new CursorTrashingParameters();
		this.rageClickParameters = rageClickParameters ?? new RageClickParameters();
		this.randomScrollingParameters = randomScrollingParameters ?? new RandomScrollingParameters();
		this.mode = mode ?? Modes.SILENT;
	}
}
