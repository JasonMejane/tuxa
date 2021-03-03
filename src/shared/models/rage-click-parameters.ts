import { BehaviorParameters } from './behavior-parameters.model';
import { Constants } from '../config/constants';

export class RageClickParameters implements BehaviorParameters {
	public threshold: number;
	public timeRange: number;

	constructor(behaviorParameters?: BehaviorParameters) {
		this.threshold = behaviorParameters?.threshold ?? Constants.RAGE_CLICK.threshold;
		this.timeRange = behaviorParameters?.timeRange ?? Constants.RAGE_CLICK.timeRange;
	}
}
