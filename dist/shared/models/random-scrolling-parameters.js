import { Constants } from '../config/constants';
var RandomScrollingParameters = /** @class */ (function () {
    function RandomScrollingParameters(behaviorParameters) {
        var _a, _b;
        this.threshold = (_a = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.threshold) !== null && _a !== void 0 ? _a : Constants.RANDOM_SCROLLING.threshold;
        this.timeRange = (_b = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.timeRange) !== null && _b !== void 0 ? _b : Constants.RANDOM_SCROLLING.timeRange;
    }
    return RandomScrollingParameters;
}());
export { RandomScrollingParameters };
//# sourceMappingURL=random-scrolling-parameters.js.map