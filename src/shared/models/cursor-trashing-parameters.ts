import { BehaviorParameters } from './behavior-parameters.model';
import { Constants } from '../config/constants';

export class CursorTrashingParameters implements BehaviorParameters {
	public threshold: number;
	public timeRange: number;

	constructor(behaviorParameters?: BehaviorParameters) {
		this.threshold = behaviorParameters?.threshold ?? Constants.CURSOR_TRASHING.threshold;
		this.timeRange = behaviorParameters?.timeRange ?? Constants.CURSOR_TRASHING.timeRange;
	}
}
