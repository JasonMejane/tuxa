import { BehaviorParameters } from './behavior-parameters.model';
import { Constants } from '../config/constants';

export class RandomScrollingParameters implements BehaviorParameters {
	public threshold: number;
	public timeRange: number;

	constructor(behaviorParameters?: BehaviorParameters) {
		this.threshold = behaviorParameters?.threshold ?? Constants.RANDOM_SCROLLING.threshold;
		this.timeRange = behaviorParameters?.timeRange ?? Constants.RANDOM_SCROLLING.timeRange;
	}
}
