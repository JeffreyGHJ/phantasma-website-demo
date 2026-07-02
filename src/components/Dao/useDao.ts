import { fetchProposals, fetchSpace } from '../../state/dao/apis';
import {
	proposalStateFilters,
	proposalStates,
} from '../../state/dao/constants';
import { useEffect, useRef, useState } from 'react';
import {
	useLastPage,
	usePage,
	useProposalStateFilter,
	useProposals,
	useProposalsPerPage,
	useSpace,
	useUpdateLastPage,
	useUpdatePage,
	useUpdateProposalStateFilter,
	useUpdateProposals,
} from '../../state/dao/dao.hooks';

import Space from '../../state/dao/types/Space';
import { removeMarkdown } from '../../utils/StringUtil';

export const useDao = () => {
	const spaceURL = useSpace();
	const proposalsPerPage = useProposalsPerPage();
	const proposalStateFilter = useProposalStateFilter();
	const setProposalsStateFilter = useUpdateProposalStateFilter();
	const page = usePage();
	const setPage = useUpdatePage();
	const lastPage = useLastPage();
	const setLastPage = useUpdateLastPage();
	const proposals = useProposals();
	const setProposals = useUpdateProposals();
	/***************************/
	const [space, setSpace] = useState(null as null | Space);

	// Pagination
	const handlePageChange = (value: number) => {
		setPage(+value);
	};

	// Filter
	const handleFilterChange = (evt) => {
		setProposalsStateFilter(evt.target.value);
	};

	const _fetchProposals = async () => {
		const proposalsState = proposalStates[proposalStateFilter];
		let author_in = [] as Array<string>;
		if (proposalStateFilter === proposalStateFilters.CORE) {
			if (space) {
				author_in = space.admins;
			}
		}
		fetchProposals({
			first: proposalsPerPage * 2,
			skip: (page - 1) * proposalsPerPage,
			space: spaceURL,
			state: proposalsState,
			author_in,
		}).then(async (_proposals) => {
			if (_proposals.length <= proposalsPerPage) {
				setLastPage(page);
			} else {
				if (lastPage <= page) {
					setLastPage(page + 1);
				}
			}
			return Promise.all(
				_proposals.slice(0, proposalsPerPage).map(async (_proposal) => {
					return {
						..._proposal,
						body: await removeMarkdown(_proposal.body),
					};
				})
			).then((strippedProposals) => {
				setProposals(strippedProposals);
			});
		});
	};

	const _fetchSpace = async () => {
		fetchSpace({ id: spaceURL }).then((_space) => {
			setSpace(_space);
		});
	};

	const init = useRef(false);
	useEffect(() => {
		if (!init.current) {
			init.current = true;
			return;
		}
		_fetchProposals();
		_fetchSpace();
	}, [page, proposalStateFilter]);

	useEffect(() => {
		_fetchProposals();
		_fetchSpace();
	}, []);

	return {
		spaceURL,
		proposalsPerPage,
		proposalStateFilter,
		setProposalsStateFilter,
		page,
		setPage,
		lastPage,
		setLastPage,
		proposals,
		setProposals,
		handlePageChange,
		handleFilterChange,
		space,
	};
};
