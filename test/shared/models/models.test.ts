import { BehaviorParameters } from '../../../src/shared/models/behavior-parameters.model';
import { CursorTrashingParameters } from '../../../src/shared/models/cursor-trashing-parameters';
import { RageClickParameters } from '../../../src/shared/models/rage-click-parameters';
import { RandomScrollingParameters } from '../../../src/shared/models/random-scrolling-parameters';

describe('Models', () => {
	describe('CursorTrashingParameters', () => {
		it('should set parameters', () => {
			let bP = new BehaviorParameters(10, 10);
			let cTP = new CursorTrashingParameters(bP);

			expect(cTP.threshold).toEqual(10);
			expect(cTP.timeRange).toEqual(10);
		});
	});

	describe('RageClickParameters', () => {
		it('should set parameters', () => {
			let bP = new BehaviorParameters(10, 10);
			let rCP = new RageClickParameters(bP);

			expect(rCP.threshold).toEqual(10);
			expect(rCP.timeRange).toEqual(10);
		});
	});

	describe('RandomScrollingParameters', () => {
		it('should set parameters', () => {
			let bP = new BehaviorParameters(10, 10);
			let rSP = new RandomScrollingParameters(bP);

			expect(rSP.threshold).toEqual(10);
			expect(rSP.timeRange).toEqual(10);
		});
	});
});
