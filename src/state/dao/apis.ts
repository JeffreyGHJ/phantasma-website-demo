import Proposal from './types/Proposal';
import ScoreResult from './types/ScoreResult';
import Space from './types/Space';
import Strategy from './types/Strategy';
import Vote from './types/Vote';
import axios from 'axios';

export const fetchProposals = async ({
	first,
	skip,
	space,
	state,
	author_in = [],
}: {
	first: number;
	skip: number;
	space: string;
	state: string;
	author_in?: Array<string>;
}) => {
	const results: any = await axios.post('https://hub.snapshot.org/graphql', {
		operationName: 'Proposals',
		query: `query Proposals($first: Int!, $skip: Int!, $state: String!, $space: String, $space_in: [String], $author_in: [String]) {
                proposals(
                    first: $first
                    skip: $skip
                    where: {space: $space, state: $state, space_in: $space_in, author_in: $author_in}
                ) {
                    id
                    ipfs
                    title
                    body
                    start
                    end
                    state
                    author
                    created
                    choices
                    space {
                        id
                        name
                        members
                        avatar
                        symbol
                    }
                    scores_state
                    scores_total
                    scores
                    votes
					type
                }
            }`,
		variables: {
			first,
			skip,
			space,
			state,
			author_in,
		},
	});

	return results.data.data.proposals as Array<Proposal>;
};

export const fetchProposal = async ({ id }: { id: string }) => {
	const results: any = await axios.post('https://hub.snapshot.org/graphql', {
		operationName: 'Proposal',
		query: `query Proposal($id: String!) {
            proposal(id: $id) {
              id
              ipfs
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              created
              plugins
              network
              type
              strategies {
                name
				network
                params
              }
              space {
                id
                name
              }
              scores_state
              scores
              scores_by_strategy
              scores_total
              votes
            }
          }`,
		variables: {
			id,
		},
	});

	return results.data.data.proposal as Proposal;
};

export const fetchVotes = async ({
	first,
	id,
	orderBy,
	orderDirection,
	skip = 0,
	voter = '',
}: {
	first: number;
	id: string;
	orderBy: string;
	orderDirection: string;
	skip?: number;
	voter?: string;
}) => {
	const results: any = await axios.post('https://hub.snapshot.org/graphql', {
		operationName: 'Votes',
		query: `query Votes($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: OrderDirection, $voter: String) {
            votes(
              first: $first
              skip: $skip
              where: {proposal: $id, vp_gt: 0, voter: $voter}
              orderBy: $orderBy
              orderDirection: $orderDirection
            ) {
              id
              ipfs
              voter
              created
              choice
              vp
              vp_by_strategy
            }
        }`,
		variables: {
			first,
			id,
			orderBy,
			orderDirection,
			skip,
			voter,
		},
	});
	return results.data.data.votes as Array<Vote>;
};

export const fetchAllVotes = async ({ id }: { id: string }) => {
	const maxFetch = 50; //max fetching 50 times
	const votesPerFetch = 20000;
	let numFetched = 0;
	let votes = [] as Array<Vote>;

	while (numFetched < maxFetch) {
		const _votes = await fetchVotes({
			first: votesPerFetch,
			id,
			orderBy: 'vp',
			orderDirection: 'desc',
			skip: numFetched * votesPerFetch,
		});
		votes = votes.concat(_votes);
		if (_votes.length < votesPerFetch) {
			break;
		}
		numFetched += 1;
	}

	return votes;
};

export const fetchVoteByVoter = async ({
	id,
	voter,
}: {
	id: string;
	voter: string;
}) => {
	const first = 1;
	const orderBy = 'vp';
	const orderDirection = 'desc';
	const skip = 0;

	const results: any = await axios.post('https://hub.snapshot.org/graphql', {
		operationName: 'Votes',
		query: `query Votes($id: String!, $first: Int, $skip: Int, $orderBy: String, $orderDirection: OrderDirection, $voter: String) {
			votes(
			  first: $first
			  skip: $skip
			  where: {proposal: $id, vp_gt: 0, voter: $voter}
			  orderBy: $orderBy
			  orderDirection: $orderDirection
			) {
			  id
			  ipfs
			  voter
			  created
			  choice
			  vp
			  vp_by_strategy
			}
		  }`,
		variables: {
			first,
			id,
			orderBy,
			orderDirection,
			skip,
			voter,
		},
	});

	return results.data.data.votes.length
		? (results.data.data.votes[0] as Vote)
		: null;
};

export const fetchScores = async ({
	addresses,
	network,
	snapshot,
	space,
	strategies,
}: {
	addresses: Array<string>;
	network: string;
	snapshot: number | string;
	space: string;
	strategies: Array<Strategy>;
}) => {
	const response: any = await axios.post(
		'https://score.snapshot.org/api/scores',
		{
			params: {
				addresses,
				network,
				snapshot,
				space,
				strategies,
			},
		}
	);

	return response.data.result as ScoreResult;
};

export const fetchSpace = async ({ id }: { id: string }) => {
	const results: any = await axios.post('https://hub.snapshot.org/graphql', {
		operationName: 'Spaces',
		query: `query Spaces($id_in: [String]) {
			spaces(where: {id_in: $id_in}) {
			  id
			  name
			  about
			  network
			  symbol
			  network
			  terms
			  skin
			  avatar
			  twitter
			  github
			  private
			  domain
			  members
			  admins
			  categories
			  plugins
			  followersCount
			  voting {
				delay
				period
				type
				quorum
				hideAbstain
			  }
			  strategies {
				name
				network
				params
			  }
			  validation {
				name
				params
			  }
			  filters {
				minScore
				onlyMembers
			  }
			}
		  }`,
		variables: {
			id_in: [id],
		},
	});

	return results.data.data.spaces.length
		? (results.data.data.spaces[0] as Space)
		: null;
};
