export const getLengthWeakness = (password: string) => {
	const length = password.length;

	if (length <= 5) {
		return {
			message: 'Your password is too short',
			deduction: 40,
		};
	}

	if (length <= 10) {
		return {
			message: 'Your password could be longer',
			deduction: 15,
		};
	}

	return null;
};

export const getUppercaseWeakness = (password: string) => {
	return getCharacterTypeWeakness(password, /[A-Z]/g, 'uppercase characters');
};

export const getLowercaseWeakness = (password: string) => {
	return getCharacterTypeWeakness(password, /[a-z]/g, 'lowercase characters');
};

export const getNumberWeakness = (password: string) => {
	return getCharacterTypeWeakness(password, /[0-9]/g, 'numbers');
};

export const getSpecialCharactersWeakness = (password: string) => {
	return getCharacterTypeWeakness(
		password,
		/[^0-9a-zA-Z\s]/g,
		'special characters'
	);
};

export const getCharacterTypeWeakness = (password, regex, type) => {
	const matches = password.match(regex) || [];

	if (matches.length === 0) {
		return {
			message: `Your password has no ${type}`,
			deduction: 50,
		};
	}

	if (matches.length <= 2) {
		return {
			message: `Your password could use more ${type}`,
			deduction: 5,
		};
	}

	return null;
};

export const getRepeatCharactersWeakness = (password) => {
	const matches = password.match(/(.)\1/g) || [];
	if (matches.length > 0) {
		return {
			message: 'Your password has repeat characters',
			deduction: matches.length * 10,
		};
	}
	return null;
};

export const calculatePasswordStrength = (password: string) => {
	const weaknesses = [] as Array<{
		message: string;
		deduction: number;
	}>;
	const lengthWeakness = getLengthWeakness(password);
	if (lengthWeakness) {
		weaknesses.push(lengthWeakness);
	}

	const lowercaseWeakness = getLowercaseWeakness(password);
	if (lowercaseWeakness) {
		weaknesses.push(lowercaseWeakness);
	}

	const uppercaseWeakness = getUppercaseWeakness(password);
	if (uppercaseWeakness) {
		weaknesses.push(uppercaseWeakness);
	}

	const numberWeakness = getNumberWeakness(password);
	if (numberWeakness) {
		weaknesses.push(numberWeakness);
	}

	const specialCharactersWeakness = getSpecialCharactersWeakness(password);
	if (specialCharactersWeakness) {
		weaknesses.push(specialCharactersWeakness);
	}

	const repeatCharactersWeakness = getRepeatCharactersWeakness(password);
	if (repeatCharactersWeakness) {
		weaknesses.push(repeatCharactersWeakness);
	}

	return weaknesses.sort((a, b) => {
		return b.deduction - a.deduction;
	});
};
