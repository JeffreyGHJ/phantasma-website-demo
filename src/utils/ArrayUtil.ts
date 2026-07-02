import { cloneDeep } from 'lodash';
import { randomNumber } from './MathUtil';

export const maxValueIndex = (arr: Array<number>) => {
	const max = Math.max(...arr);
	const index = arr.indexOf(max);
	return index;
};

export const softEqual = (arr1: Array<any>, arr2: Array<any>) => {
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (let i = 0; i < arr1.length; i++) {
		const item = arr1[i];
		if (!arr2.includes(item)) {
			return false;
		}
	}
	return true;
};

export const shuffleArray = (_array: Array<any>) => {
	const array = cloneDeep(_array);
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export const findLastIndex = (
	array: Array<any>,
	predicate: (item: any) => boolean
) => {
	const _array = cloneDeep(array);
	_array.reverse();

	const index = _array.findIndex(predicate);
	if (index === -1) {
		return index;
	}

	return _array.length - 1 - index;
};

export const findRandomIndexAfter = (
	array: Array<any>,
	startIndex: number,
	predicate: (item: any) => boolean
) => {
	const _array = cloneDeep(array);
	if (startIndex >= _array.length || startIndex < 0) {
		return -1;
	}

	const _newArray = _array.slice(startIndex);
	const indexArray = [] as Array<number>;
	_newArray.forEach((item, index) => {
		if (predicate(item)) {
			indexArray.push(startIndex + index);
		}
	});
	if (!indexArray.length) {
		return -1;
	}

	const rand = randomNumber(0, indexArray.length - 1);
	return indexArray[rand];
};
