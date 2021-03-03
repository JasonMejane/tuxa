import { CursorTrashingParameters } from '../models/cursor-trashing-parameters';
import { RageClickParameters } from '../models/rage-click-parameters';
import { RandomScrollingParameters } from '../models/random-scrolling-parameters';
var Config = /** @class */ (function () {
    function Config(mode, cursorTrashingParameters, rageClickParameters, randomScrollingParameters) {
        this.cursorTrashingParameters = cursorTrashingParameters !== null && cursorTrashingParameters !== void 0 ? cursorTrashingParameters : new CursorTrashingParameters();
        this.rageClickParameters = rageClickParameters !== null && rageClickParameters !== void 0 ? rageClickParameters : new RageClickParameters();
        this.randomScrollingParameters = randomScrollingParameters !== null && randomScrollingParameters !== void 0 ? randomScrollingParameters : new RandomScrollingParameters();
        this.mode = mode !== null && mode !== void 0 ? mode : 1 /* SILENT */;
    }
    return Config;
}());
export { Config };
//# sourceMappingURL=config.js.map