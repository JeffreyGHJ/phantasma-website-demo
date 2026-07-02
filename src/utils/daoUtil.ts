export const totalStrategyVotes = (vp_by_strategy: Array<number>) => {
	return vp_by_strategy.reduce((curr, prev) => {
		return curr + prev;
	}, 0);
};
