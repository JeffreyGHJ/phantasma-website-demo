export const proposalStateFilters = {
	ALL: 'ALL',
	ACTIVE: 'ACTIVE',
	PENDING: 'PENDING',
	CLOSED: 'CLOSED',
	CORE: 'CORE',
};

export const proposalStates = {
	ALL: 'all',
	ACTIVE: 'active',
	PENDING: 'pending',
	CLOSED: 'closed',
	CORE: 'all',
};

export const proposalTypes = {
	SINGLE_CHOICE: 'single-choice',
	APPROVAL: 'approval',
	QUADRATIC: 'quadratic',
	RANKED: 'ranked-choice',
	WEIGHTED: 'weighted',
	BASIC: 'basic',
};

export const votingSystemsDisplay = {
	[proposalTypes.SINGLE_CHOICE]: 'Single choice voting',
	[proposalTypes.APPROVAL]: 'Approval voting',
	[proposalTypes.QUADRATIC]: 'Quadratic voting',
	[proposalTypes.RANKED]: 'Ranked choice voting',
	[proposalTypes.WEIGHTED]: 'Weighted voting',
	[proposalTypes.BASIC]: 'Basic voting',
};

export const votingSystems = [
	{
		id: proposalTypes.SINGLE_CHOICE,
		title: 'Single choice voting',
		description: 'Each voter may select only one choice.',
	},
	{
		id: proposalTypes.APPROVAL,
		title: 'Approval voting',
		description: 'Each voter may select any number of choices.',
	},
	{
		id: proposalTypes.QUADRATIC,
		title: 'Quadratic voting',
		description:
			'Each voter may spread voting power across any number of choices. Results are calculated quadratically.',
	},
	{
		id: proposalTypes.RANKED,
		title: 'Ranked choice voting',
		description:
			'Each voter may select and rank any number of choices. Results are calculated by instant-runoff counting method.',
	},
	{
		id: proposalTypes.WEIGHTED,
		title: 'Weighted voting',
		description:
			'Each voter may spread voting power across any number of choices.',
	},
	{
		id: proposalTypes.BASIC,
		title: 'Basic voting',
		description:
			'Single choice voting with three choices: For, Against or Abstain',
	},
];
