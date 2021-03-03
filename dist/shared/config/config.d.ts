import { CursorTrashingParameters } from '../models/cursor-trashing-parameters';
import { RageClickParameters } from '../models/rage-click-parameters';
import { RandomScrollingParameters } from '../models/random-scrolling-parameters';
import { BehaviorParameters } from '../models/behavior-parameters.model';
import { Modes } from '../enums/modes';
export declare class Config {
    cursorTrashingParameters: CursorTrashingParameters;
    rageClickParameters: RageClickParameters;
    randomScrollingParameters: RandomScrollingParameters;
    mode: Modes;
    constructor(mode?: Modes, cursorTrashingParameters?: BehaviorParameters, rageClickParameters?: BehaviorParameters, randomScrollingParameters?: BehaviorParameters);
}
