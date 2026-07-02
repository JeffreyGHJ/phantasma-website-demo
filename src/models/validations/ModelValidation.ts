import BaseModel from '../BaseModel';

class ModelValidation {
	static isRequired({
		attr,
		value,
		item,
	}: {
		attr: string;
		value: any;
		item: BaseModel;
	}) {
		if (value === null || value === undefined) {
			throw new Error(`${item.constructor.name}: ${attr} is required`);
		}
	}

	static between({
		attr,
		value,
		item,
		inclusive,
		start,
		end,
	}: {
		attr: string;
		value: number;
		item: BaseModel;
		inclusive: boolean;
		start: number;
		end: number;
	}) {
		if (start > end) {
			throw new Error('between rule misconfigured');
		}

		if (
			(inclusive && (value < start || value > end)) ||
			(!inclusive && (value <= start || value >= end))
		) {
			throw new Error(
				`${item.constructor.name}: ${attr} is not between ${start} and ${end}`
			);
		}
	}
}

export default ModelValidation;
