import { isNumber, isString } from 'lodash';

export const zeros = (num) => {
	let str = '';
	for (let i = 0; i < num; i++) {
		str += '0';
	}
	return str;
};

export const removeLeadingZeros = (num: string) => {
	return num.replace(/^0+/, '');
};

/**
 * Adds numbers one digit at a time and returns the sum in string format
 * @param {number} num1 - First number
 * @param {number} num2 - Second Number
 * @returns {string} sum
 */
export const addLargeIntegers = (
	num1: number | string,
	num2: number | string
) => {
	// num1 and num2 need to have the same type
	if (
		(isNumber(num1) && !isNumber(num2)) ||
		(isString(num1) && !isString(num2))
	) {
		throw new Error('Numbers are not the same type');
	}
	let result = '',
		largerNum: any,
		smallerNum: any;
	let temp = num1;
	if (
		(isNumber(num1) && isNumber(num2) && num1 < num2) ||
		(isString(num1) && isString(num2) && num1.length < num2.length)
	) {
		num1 = num2;
		num2 = temp;
	}

	largerNum = num1.toString();
	smallerNum = num2.toString();
	const arr1 = largerNum.split('').reverse();
	const arr2 = smallerNum.split('').reverse();
	let carry = 0;
	arr1.forEach((n, i) => {
		let sum = 0 as any;
		if (i >= arr2.length) {
			sum = +arr1[i] + carry;
			if (sum > 9) {
				carry = 1;
			} else {
				carry = 0;
			}
		} else {
			sum = +arr1[i] + +arr2[i] + carry;
			if (sum > 9) {
				carry = 1;
			} else {
				carry = 0;
			}
		}
		sum = sum.toString();
		result = sum[sum.length - 1] + result;
	});
	// e.g 99 + 1 = 100 (append 1 in the front)
	if (carry === 1) {
		result = '1' + result;
	}
	return result;
};

export const solidityTokenFormat = (amount: number | string, scale: number) => {
	let integers = '',
		decimals = '';
	if (isNumber(amount)) {
		amount = amount.toString();
	}
	const amounts = amount.split('.');
	integers = amounts[0];
	if (amounts.length > 1) {
		decimals = removeLeadingZeros(amounts[1]);
		const numLeadingZeros = amounts[1].length - decimals.length;
		if (decimals) {
			decimals += zeros(scale - (numLeadingZeros + decimals.length));
		}
	}
	if (+integers) {
		integers += zeros(scale);
	}
	if (!+integers && !decimals) {
		return '0';
	}
	if (!decimals) {
		return integers;
	}
	if (!integers) {
		return decimals;
	}
	return addLargeIntegers(integers, decimals);
};

export const fromSolidityTokenFormat = (
	amount: number | string | bigint,
	scale: number
): string => {
	if (Number(amount) === 0) {
		return '0';
	}
	if (!isString(amount)) {
		amount = amount.toString();
	}
	if (amount.length === scale) {
		return `0.${amount}`;
	}
	if (amount.length < scale) {
		return `0.${zeros(scale - amount.length)}${amount}`;
	}
	const set = new Set(amount.slice(-scale));
	if (set.size === 1 && set.has('0')) {
		return amount.slice(0, amount.length - scale);
	}
	return amount.slice(0, amount.length - scale) + '.' + amount.slice(-scale);
};

/**
 * compares if the first number is greater than the second number
 * @param {number} num1 - First number
 * @param {number} num2 - Second Number
 * @returns {boolean}
 */
export const isGreaterThan = (
	num1: number | string,
	num2: number | string,
	scale: number
): boolean => {
	num1 = solidityTokenFormat(num1, scale);
	num2 = solidityTokenFormat(num2, scale);
	if (num1.length > num2.length) {
		return true;
	}
	if (num1.length < num2.length) {
		return false;
	}
	for (let i = 0; i < num2.length; i++) {
		if (+num1[i] > +num2[i]) {
			return true;
		}
	}
	return false;
};

/**
 * Returns a random inclusive number of a min and max
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number}
 */
export const randomNumber = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
};
