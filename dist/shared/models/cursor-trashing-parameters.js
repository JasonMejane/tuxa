import { Constants } from '../config/constants';
var CursorTrashingParameters = /** @class */ (function () {
    function CursorTrashingParameters(behaviorParameters) {
        var _a, _b;
        this.threshold = (_a = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.threshold) !== null && _a !== void 0 ? _a : Constants.CURSOR_TRASHING.threshold;
        this.timeRange = (_b = behaviorParameters === null || behaviorParameters === void 0 ? void 0 : behaviorParameters.timeRange) !== null && _b !== void 0 ? _b : Constants.CURSOR_TRASHING.timeRange;
    }
    return CursorTrashingParameters;
}());
export { CursorTrashingParameters };
//# sourceMappingURL=cursor-trashing-parameters.js.map