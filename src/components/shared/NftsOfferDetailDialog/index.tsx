import './index.scss';

import { Grid, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';

import Loading from '../../widgets/Loading';
import LootboxABI from '../../../constants/abis/bsc/LootboxABI';
import LootboxUtilModel from '../../../models/util_models/LootboxUtilModel';
import Modal from '../../widgets/Modal';
import { Multicall } from 'ethereum-multicall';
import NftOffer from '../../../constants/types/NftOffer';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import Translation from '../../widgets/Translation';
import Web3 from 'web3';
import { activeNode } from '../../../constants/Nodes';
import { blockchains } from '../../../constants/Blockchains';
import { collectionItemImageUrl } from '../../../utils/collectionitemUtils';
import { fetchCollectionItemsByIds } from '../../../apis/web/web.api';
import { lootboxContractAddress } from '../../../constants/ContractAddresses';
import { useActiveWeb3React } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import { useView3d } from '../../../state/application/hooks';

const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: false });

const NftsOfferDetailDialog = ({
	open,
	onClose,
	offer,
	onAcceptOffer,
	onRejectOffer,
	onCancelOffer,
	onApprove,
	ownerAddress,
	approved,
}: {
	open: boolean;
	onClose: () => void;
	offer: NftOffer;
	onAcceptOffer: () => void;
	onRejectOffer: () => void;
	onCancelOffer: () => void;
	onApprove: () => void;
	ownerAddress: string;
	approved: boolean;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.NftsOfferDetailDialog',
	});

	const { account } = useActiveWeb3React();
	const [tokens, setTokens] = useState([] as Array<any>);
	const [activeStep, setActiveStep] = useState(0);
	const view3d = useView3d();

	useEffect(() => {
		if (approved) {
			setActiveStep(1);
		} else {
			setActiveStep(0);
		}
	}, [approved]);

	useEffect(() => {
		let mounted = true;
		if (offer.soldNftIds) {
			fetchCollectionItemsByIds({
				blockchain: blockchains.BSC,
				collection: offer.soldNftAddress,
				ids: offer.soldNftIds,
			}).then((res: any) => {
				if (res.data) {
					const lootboxContractCallContext = [
						{
							reference: 'lootboxContract',
							contractAddress: lootboxContractAddress,
							abi: LootboxABI,
							calls: res.data.map((box: any) => {
								return {
									reference: 'getLootboxCall',
									methodName: 'getLootbox',
									methodParameters: [box.id],
								};
							}),
						},
					];

					multicall
						.call(lootboxContractCallContext)
						.then((response) => {
							if (response.results.lootboxContract) {
								response.results.lootboxContract.callsReturnContext.forEach(
									(ctx, index) => {
										res.data[index].requestID =
											web3.utils.hexToNumberString(
												ctx.returnValues[1].hex
											);
										res.data[index].randomWords =
											ctx.returnValues[2].map((x) => {
												return web3.utils.hexToNumber(
													x.hex
												);
											});
										res.data[index].claimed =
											ctx.returnValues[3];

										LootboxUtilModel.loadLootboxImage(
											res.data[index]
										);
									}
								);
								if (mounted) {
									setTokens(res.data);
								}
							}
						});
				}
			});
		}

		return () => {
			mounted = false;
		};
	}, [offer]);

	return (
		<Modal open={open} onClose={onClose} className='NftsOfferDetailDialog'>
			<div className='NftsOfferDetailDialog-Content'>
				<Grid
					container
					justifyContent='center'
					spacing={3}
					className='mt-1'
				>
					{tokens.map((token) => {
						return (
							<Grid item key={`${token.address}-${token.id}`}>
								<img
									src={collectionItemImageUrl({
										item: token,
										view3d,
									})}
									alt=''
									width='100'
									height='100'
									style={{
										borderRadius: '100%',
										objectFit: 'cover',
									}}
								/>
								<div className='color-white'>
									ID: {token.id}
								</div>
								<Loading loading={!ready}>
									{token.rank != null && (
										<div className='color-white'>
											{t('rank', {
												defaultValue: 'Rank',
											})}
											:{` ${token.rank}`}
										</div>
									)}
								</Loading>
							</Grid>
						);
					})}
				</Grid>

				<div className='pt-3'>
					<div className='cancel-reject'>
						{account &&
							account.toLowerCase() ===
								offer.buyer.toLowerCase() && (
								<Translation ready={ready}>
									<OutlinedButton
										onClick={() => onCancelOffer()}
									>
										<Loading loading={!ready}>
											{t('cancel', {
												defaultValue: 'Cancel',
											})}
										</Loading>
									</OutlinedButton>
								</Translation>
							)}
						{account &&
							account.toLowerCase() ===
								ownerAddress.toLowerCase() && (
								<Translation ready={ready}>
									<OutlinedButton
										onClick={() => onRejectOffer()}
									>
										<Loading loading={!ready}>
											{t('reject', {
												defaultValue: 'Reject',
											})}
										</Loading>
									</OutlinedButton>
								</Translation>
							)}
					</div>
					{account &&
						account.toLowerCase() ===
							ownerAddress.toLowerCase() && (
							<div className='full-width'>
								<div className='full-width mt-3'>
									<Stepper
										activeStep={activeStep}
										alternativeLabel
									>
										<Step>
											<StepLabel key={'Approve'}>
												{approved ? (
													<Translation ready={ready}>
														<OutlinedButton
															disabled
														>
															<Loading
																loading={!ready}
															>
																{t('approved', {
																	defaultValue:
																		'Approved',
																})}
															</Loading>
														</OutlinedButton>
													</Translation>
												) : (
													<Translation ready={ready}>
														<OutlinedButton
															onClick={() =>
																onApprove()
															}
														>
															<Loading
																loading={!ready}
															>
																{t('approve', {
																	defaultValue:
																		'Approve',
																})}
															</Loading>
														</OutlinedButton>
													</Translation>
												)}
											</StepLabel>
										</Step>
										<Step>
											<StepLabel key={'Accept'}>
												{approved ? (
													<Translation ready={ready}>
														<OutlinedButton
															onClick={() =>
																onAcceptOffer()
															}
														>
															<Loading
																loading={!ready}
															>
																{t('accept', {
																	defaultValue:
																		'Accept',
																})}
															</Loading>
														</OutlinedButton>
													</Translation>
												) : (
													<Translation ready={ready}>
														<OutlinedButton
															onClick={() =>
																onAcceptOffer()
															}
															disabled
														>
															<Loading
																loading={!ready}
															>
																{t('accept', {
																	defaultValue:
																		'Accept',
																})}
															</Loading>
														</OutlinedButton>
													</Translation>
												)}
											</StepLabel>
										</Step>
									</Stepper>
								</div>
							</div>
						)}
				</div>
			</div>
		</Modal>
	);
};

export default NftsOfferDetailDialog;
