import { Constants } from '../config/constants';
var RageClickParameters = /** @class */ (function () {
    function RageClickParameters(behaviorParameters) {
        var _a, _b;
        this.threshold = (_a = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.threshold) !== null && _a !== void 0 ? _a : Constants.RAGE_CLICK.threshold;
        this.timeRange = (_b = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.timeRange) !== null && _b !== void 0 ? _b : Constants.RAGE_CLICK.timeRange;
    }
    return RageClickParameters;
}());
export { RageClickParameters };
//# sourceMappingURL=rage-click-parameters.js.map