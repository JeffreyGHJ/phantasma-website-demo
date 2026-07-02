export const rank = (number) => {
	const j = number % 10;
	const k = number % 100;
	if (j === 1 && k !== 11) {
		return number + 'st';
	}
	if (j === 2 && k !== 12) {
		return number + 'nd';
	}
	if (j === 3 && k !== 13) {
		return number + 'rd';
	}
	return number + 'th';
};

export const isWholeNumber = (number: number) => {
	return number % 1 === 0;
};

export const getHumanReadableLargeNumber = ({
	number,
	precision,
}: {
	number: number;
	precision: number;
}) => {
	const returnData = {
		number: 0,
		unit: '',
	};

	if (number < 1000) {
		returnData.number = +number.toFixed(precision);
		return returnData;
	}

	if (number > 1000000000000) {
		returnData.unit = 'T';
	} else if (number > 1000000000) {
		returnData.unit = 'B';
	} else if (number > 1000000) {
		returnData.unit = 'M';
	} else {
		returnData.unit = 'K';
	}

	const useNext = number.toFixed().length % 3 === 0;
	const chunks = number.toFixed().length / 3;

	returnData.number = +(
		number /
		1000 ** Math.floor(useNext ? chunks - 1 : chunks)
	).toFixed(precision);

	return returnData;
};

export const extractNumbersFromString = (str: string) => {
	return str.replace(/\D/g, '');
};
