import {
	updateLastPage,
	updatePage,
	updateProposalStateFilter,
	updateProposals,
} from './dao.slice';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '..';
import Proposal from './types/Proposal';
import { useCallback } from 'react';

export const useSpace = (): string => {
	return useSelector((state: AppState) => state.dao.space);
};

export const useProposalsPerPage = (): number => {
	return useSelector((state: AppState) => state.dao.proposalsPerPage);
};

export const useProposalStateFilter = (): string => {
	return useSelector((state: AppState) => state.dao.proposalStateFilter);
};

export const useUpdateProposalStateFilter = (): ((filter: string) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(filter) => dispatch(updateProposalStateFilter(filter)),
		[dispatch]
	);
};

export const usePage = (): number => {
	return useSelector((state: AppState) => state.dao.page);
};

export const useUpdatePage = (): ((page: number) => void) => {
	const dispatch = useDispatch();
	return useCallback((page) => dispatch(updatePage(page)), [dispatch]);
};

export const useLastPage = (): number => {
	return useSelector((state: AppState) => state.dao.lastPage);
};

export const useUpdateLastPage = (): ((lastPage: number) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(lastPage) => dispatch(updateLastPage(lastPage)),
		[dispatch]
	);
};

export const useProposals = (): Array<Proposal> => {
	return useSelector((state: AppState) => state.dao.proposals);
};
export const useUpdateProposals = (): ((
	proposals: Array<Proposal>
) => void) => {
	const dispatch = useDispatch();
	return useCallback(
		(proposals) => dispatch(updateProposals(proposals)),
		[dispatch]
	);
};
