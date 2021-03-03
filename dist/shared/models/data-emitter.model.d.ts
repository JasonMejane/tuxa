import { DataType } from '../enums/data-type';
export declare class DataEmitter<T> {
    data: T;
    type: DataType;
    constructor(type: DataType, data: T);
}
