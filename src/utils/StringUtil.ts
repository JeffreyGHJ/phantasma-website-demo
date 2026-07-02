import { remark } from 'remark';
import strip from 'strip-markdown';

export const displayUntilLength = (str: string, len: number) => {
	if (str.length <= len) {
		return str;
	}
	return str.substring(0, len) + '...';
};

export const displayAddress = (
	address: string,
	beginLen: number,
	endLen: number
) => {
	if (!address.length || beginLen + endLen >= address.length) {
		return address;
	}

	return displayUntilLength(address, beginLen) + address.substr(-endLen);
};

export const stripCharacters = (str: string, chars: Array<string>) => {
	const reg = new RegExp(`[${chars.join(',')}]`, 'g');
	return str.replaceAll(reg, '');
};

export const abbreviateAddress = (address: string) => {
	return address.slice(0, 6) + '...' + address.slice(-4);
};

export const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const removeMarkdown = async (str: string): Promise<string> => {
	return remark()
		.use(strip)
		.process(str)
		.then((file) => {
			const strippedString = String(file);
			if (strippedString.charAt(0) === '\\') {
				return strippedString.slice(1, strippedString.length - 1);
			}

			return String(file);
		});
};
