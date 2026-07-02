export const disableNext = ({
	items,
	itemsPerPage,
}: {
	items: Array<any>;
	itemsPerPage: number;
}): boolean => {
	if (items.length / itemsPerPage > 1) {
		return false;
	}
	return true;
};
