import { DataType } from '../enums/data-type';

export class DataEmitter<T> {
	public data: T;
	public type: DataType;

	constructor(type: DataType, data: T) {
		this.data = data;
		this.type = type;
	}
}
