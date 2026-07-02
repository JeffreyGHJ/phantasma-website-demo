const year = 31536000000;
const month = 2592000000;
const week = 604800000;
const day = 86400000;
const hour = 3600000;
const minute = 60000;

export const getReadableStartEndDate = (startTime: number, endTime: number) => {
	startTime = startTime * 1000;
	endTime = endTime * 1000;
	const currentTime = new Date().getTime();
	let prefix, difference;
	if (startTime > currentTime) {
		prefix = 'starts';
		difference = Math.abs(startTime - currentTime);
	} else {
		prefix = 'ends';
		difference = Math.abs(endTime - currentTime);
	}
	let count = 0;
	let unit = '';
	if (difference >= year) {
		unit = 'yr';
		count = Math.floor(difference / year);
	} else if (difference >= month) {
		unit = 'mo';
		count = Math.floor(difference / month);
	} else if (difference >= week) {
		unit = 'wk';
		count = Math.floor(difference / week);
	} else if (difference >= day) {
		const quotient = difference / day;
		if (quotient > 1) {
			unit = 'days';
		} else {
			unit = 'day';
		}
		count = Math.ceil(quotient);
	} else if (difference >= hour) {
		unit = 'hr';
		count = Math.ceil(difference / hour);
	} else if (difference >= minute) {
		unit = 'min';
		count = Math.ceil(difference / minute);
	} else {
		return `${prefix} soon.`;
	}
	return `${prefix} in ${count} ${unit}.`;
};

export const getRecentlySoldDate = (timestamp: number) => {
	timestamp = timestamp * 1000;
	const currentTime = new Date().getTime();
	let difference;
	if (timestamp > currentTime) {
		return 'N/A';
	}

	difference = Math.abs(timestamp - currentTime);

	let count = 0;
	let unit = '';
	if (difference >= year) {
		unit = 'yr';
		count = Math.floor(difference / year);
	} else if (difference >= month) {
		unit = 'mo';
		count = Math.floor(difference / month);
	} else if (difference >= week) {
		unit = 'wk';
		count = Math.floor(difference / week);
	} else if (difference >= day) {
		const quotient = difference / day;
		if (quotient > 1) {
			unit = 'days';
		} else {
			unit = 'day';
		}
		count = Math.ceil(quotient);
	} else if (difference >= hour) {
		unit = 'hr';
		count = Math.ceil(difference / hour);
	} else if (difference >= minute) {
		unit = 'min';
		count = Math.ceil(difference / minute);
	}

	return {
		days: count,
		unit,
	};
};
