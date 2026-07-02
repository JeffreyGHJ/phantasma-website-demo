export const formatAttributes = (
	attributes: Array<{ trait_type: string; value: string }>
) => {
	return attributes.reduce((prev, curr) => {
		prev[curr.trait_type] = curr.value;
		return prev;
	}, {}) as Record<string, string>;
};
