import './ProposalDetail.scss';

import React, { useEffect, useState } from 'react';
import { proposalStates, proposalTypes } from '../../../state/dao/constants';

import ApprovalActive from './Approval/Active/ApprovalActive';
import ApprovalClosed from './Approval/Closed/ApprovalClosed';
import ApprovalPending from './Approval/Pending/ApprovalPending';
import BasicActive from './Basic/Active/BasicActive';
import BasicClosed from './Basic/Closed/BasicClosed';
import BasicPending from './Basic/Pending/BasicPending';
import Proposal from '../../../state/dao/types/Proposal';
import QuadraticActive from './Quadratic/Active/QuadraticActive';
import QuadraticClosed from './Quadratic/Closed/QuadraticClosed';
import QuadraticPending from './Quadratic/Pending/QuadraticPending';
import QuickSetting from '../../widgets/SpeedDial/QuickSetting';
import RankedActive from './Ranked/Active/RankedActive';
import RankedClosed from './Ranked/Closed/RankedClosed';
import RankedPending from './Ranked/Pending/RankedPending';
import SingleChoiceActive from './SingleChoice/Active/SingleChoiceActive';
import SingleChoiceClosed from './SingleChoice/Closed/SingleChoiceClosed';
import SingleChoicePending from './SingleChoice/Pending/SingleChoicePending';
import WeightedActive from './Weighted/Active/WeightedActive';
import WeightedClosed from './Weighted/Closed/WeightedClosed';
import WeightedPending from './Weighted/Pending/WeightedPending';
import { fetchProposal } from '../../../state/dao/apis';
import { useParams } from 'react-router-dom';

const ProposalDetail = () => {
	const { id } = useParams();
	const [proposal, setProposal] = useState(null as Proposal | null);

	const refetchProposal = () => {
		if (id) {
			fetchProposal({ id }).then((_proposal) => {
				setProposal(_proposal);
			});
		}
	};
	useEffect(() => {
		if (id) {
			fetchProposal({ id }).then((_proposal) => {
				setProposal(_proposal);
			});
		}
	}, [id]);

	return (
		<>
			<div id='ProposalDetail' className='container'>
				{proposal && (
					<>
						<ProposalComponent
							proposal={proposal}
							updateProposal={refetchProposal}
						/>
						<QuickSetting />
					</>
				)}
			</div>
		</>
	);
};

const ProposalComponent = ({
	proposal,
	updateProposal,
}: {
	proposal: Proposal;
	updateProposal: () => void;
}) => {
	if (proposal.type === proposalTypes.SINGLE_CHOICE) {
		if (proposal.state === proposalStates.CLOSED) {
			return <SingleChoiceClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<SingleChoiceActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <SingleChoicePending proposal={proposal} />;
		}
	} else if (proposal.type === proposalTypes.APPROVAL) {
		if (proposal.state === proposalStates.CLOSED) {
			return <ApprovalClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<ApprovalActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <ApprovalPending proposal={proposal} />;
		}
	} else if (proposal.type === proposalTypes.QUADRATIC) {
		if (proposal.state === proposalStates.CLOSED) {
			return <QuadraticClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<QuadraticActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <QuadraticPending proposal={proposal} />;
		}
	} else if (proposal.type === proposalTypes.RANKED) {
		if (proposal.state === proposalStates.CLOSED) {
			return <RankedClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<RankedActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <RankedPending proposal={proposal} />;
		}
	} else if (proposal.type === proposalTypes.WEIGHTED) {
		if (proposal.state === proposalStates.CLOSED) {
			return <WeightedClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<WeightedActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <WeightedPending proposal={proposal} />;
		}
	} else if (proposal.type === proposalTypes.BASIC) {
		if (proposal.state === proposalStates.CLOSED) {
			return <BasicClosed proposal={proposal} />;
		}
		if (proposal.state === proposalStates.ACTIVE) {
			return (
				<BasicActive
					proposal={proposal}
					updateProposal={updateProposal}
				/>
			);
		}
		if (proposal.state === proposalStates.PENDING) {
			return <BasicPending proposal={proposal} />;
		}
	}

	return <div></div>;
};

export default ProposalDetail;
