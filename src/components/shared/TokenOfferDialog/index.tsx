import './index.scss';

import {
	busdTokenAddress,
	ectoContractAddress,
	littleGhostsOfferContractAddress,
	wbnbTokenAddress,
} from '../../../constants/ContractAddresses';
import {
	getPaymentTokenDecimals,
	getTokenPriceInUsd,
} from '../../../utils/funcs';
import {
	handleWeb3Error,
	handleWeb3Reponse,
} from '../../../utils/Web3ResponseUtil';
import {
	useBnbPriceInUsd,
	useEctoPriceInUsd,
} from '../../../state/application/hooks';
import { useCallback, useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import { Grid } from '@mui/material';
import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OfferABI from '../../../constants/abis/OfferABI';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PaymentTokenSelect from '../../widgets/Select/PaymentTokenSelect';
import Translation from '../../widgets/Translation';
import Web3 from 'web3';
import { activeNode } from '../../../constants/Nodes';
import { fromSolidityTokenFormat } from '../../../utils/MathUtil';
import { paymentTokens } from '../../../constants/constant';
import { useActiveWeb3React } from '../../../hooks';
import { useTokenContract } from '../../../hooks/useContract';
import { useTranslation } from 'react-i18next';

const web3 = new Web3(activeNode);

//TODO: move maxAllowance to constant file
const maxAllowance =
	'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const TokenOfferDialog = ({
	open,
	imageLink,
	onClose,
	onCreateOffer,
	item,
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	onCreateOffer: ({ paymentToken, offerAmount }) => void;
	item: any;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.TokenOfferDialog',
	});

	const { account } = useActiveWeb3React();

	const [isWbnbApprovedForOffer, setIsWbnbApprovedForOffer] = useState(false);
	const [isEctoApprovedForOffer, setIsEctoApprovedForOffer] = useState(false);
	const [isBusdApprovedForOffer, setIsBusdApprovedForOffer] = useState(false);
	const [minimumOffer, setMinimumOffer] = useState(0);
	const [approved, setApproved] = useState(false);
	const [paymentToken, setPaymentToken] = useState(paymentTokens[0]);
	const [offerAmount, setOfferAmount] = useState(0);
	const ectoPrice = useEctoPriceInUsd();
	const bnbPrice = useBnbPriceInUsd();

	const wbnbTokenContract = useTokenContract(wbnbTokenAddress);
	const ectoTokenContract = useTokenContract(ectoContractAddress);
	const busdTokenContract = useTokenContract(busdTokenAddress);

	const checkIfWbnbIsApprovedForOffer = useCallback(async () => {
		if (!account || !wbnbTokenContract) {
			return;
		}

		//@ts-ignore
		const allowance = await wbnbTokenContract.allowance(
			account,
			littleGhostsOfferContractAddress
		);

		if (+allowance < +maxAllowance) {
			setIsWbnbApprovedForOffer(false);
		} else {
			setIsWbnbApprovedForOffer(true);
		}
	}, [account, wbnbTokenContract, setIsWbnbApprovedForOffer]);

	const checkIfEctoIsApprovedForOffer = useCallback(async () => {
		if (!account || !setIsEctoApprovedForOffer) {
			return;
		}

		//@ts-ignore
		const allowance = await ectoTokenContract.allowance(
			account,
			littleGhostsOfferContractAddress
		);

		if (+allowance < +maxAllowance) {
			setIsEctoApprovedForOffer(false);
		} else {
			setIsEctoApprovedForOffer(true);
		}
	}, [account, ectoTokenContract, setIsEctoApprovedForOffer]);

	const checkIfBusdIsApprovedForOffer = useCallback(async () => {
		if (!account || !busdTokenContract) {
			return;
		}

		//@ts-ignore
		const allowance = await busdTokenContract.allowance(
			account,
			littleGhostsOfferContractAddress
		);

		if (+allowance < +maxAllowance) {
			setIsBusdApprovedForOffer(false);
		} else {
			setIsBusdApprovedForOffer(true);
		}
	}, [account, busdTokenContract, setIsBusdApprovedForOffer]);

	const approveWbnbForOfferContract = async () => {
		//@ts-ignore
		await wbnbTokenContract
			.approve(littleGhostsOfferContractAddress, maxAllowance)
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting for WBNB approval',
					successMessage: 'WBNB has successfully been approved',
					res,
					callback: () => {
						setIsWbnbApprovedForOffer(true);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const approveEctoForOfferContract = async () => {
		//@ts-ignore
		await ectoTokenContract
			.approve(littleGhostsOfferContractAddress, maxAllowance)
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting for ECTO approval',
					successMessage: 'ECTO has successfully been approved',
					res,
					callback: () => {
						setIsEctoApprovedForOffer(true);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const approveBusdForOfferContract = async () => {
		//@ts-ignore
		await busdTokenContract
			.approve(littleGhostsOfferContractAddress, maxAllowance)
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting for BUSD approval',
					successMessage: 'BUSD has successfully been approved',
					res,
					callback: () => {
						setIsBusdApprovedForOffer(true);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const approve = () => {
		if (paymentToken.tokenAddress === wbnbTokenAddress) {
			approveWbnbForOfferContract();
		} else if (paymentToken.tokenAddress === ectoContractAddress) {
			approveEctoForOfferContract();
		} else if (paymentToken.tokenAddress === busdTokenAddress) {
			approveBusdForOfferContract();
		}
	};

	const getMinimumOffers = async (nftItem, tokenAddress) => {
		const OfferContract = new web3.eth.Contract(
			OfferABI as AbiItem[],
			littleGhostsOfferContractAddress
		);

		const promises = [
			OfferContract.methods.globalMinimumOffers(tokenAddress).call(),
			OfferContract.methods
				.minimumOffers(nftItem.address, nftItem.id, tokenAddress)
				.call(),
		];

		let [globalMinimum, userMinimum] = await Promise.all(promises);

		globalMinimum = BigInt(globalMinimum);
		userMinimum = BigInt(userMinimum);

		let _minimum =
			globalMinimum > userMinimum ? globalMinimum : userMinimum;

		const decimals = getPaymentTokenDecimals(tokenAddress);

		return +fromSolidityTokenFormat(_minimum, decimals);
	};

	useEffect(() => {
		checkIfWbnbIsApprovedForOffer();
		checkIfEctoIsApprovedForOffer();
		checkIfBusdIsApprovedForOffer();
	}, [
		account,
		checkIfWbnbIsApprovedForOffer,
		checkIfEctoIsApprovedForOffer,
		checkIfBusdIsApprovedForOffer,
	]);

	useEffect(() => {
		if (!item || !item.address || !item.id || !paymentToken) {
			return;
		}
		getMinimumOffers(item, paymentToken.tokenAddress).then((_minimum) => {
			setMinimumOffer(_minimum);
		});
	}, [paymentToken, item]);

	useEffect(() => {
		if (paymentToken.tokenAddress === wbnbTokenAddress) {
			setApproved(isWbnbApprovedForOffer);
		} else if (paymentToken.tokenAddress === ectoContractAddress) {
			setApproved(isEctoApprovedForOffer);
		} else if (paymentToken.tokenAddress === busdTokenAddress) {
			setApproved(isBusdApprovedForOffer);
		} else {
			setApproved(false);
		}
	}, [
		paymentToken,
		isWbnbApprovedForOffer,
		isEctoApprovedForOffer,
		isBusdApprovedForOffer,
	]);

	return (
		<Modal open={open} onClose={onClose} className='TokenOfferDialog'>
			<div className='TokenOfferDialog-Content scrollbar'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='176'
						width='176'
						style={{ objectFit: 'cover', borderRadius: '100%' }}
					/>
				</div>

				<h2 className='mt-3'>
					<Loading loading={!ready}>
						{t('title', { defaultValue: 'Offer' })}
					</Loading>
				</h2>

				<p>
					<Loading loading={!ready}>
						{t('min', { defaultValue: 'Min.' })}:{' '}
						{minimumOffer.toLocaleString()} {paymentToken.name} ($
						{getTokenPriceInUsd({
							address: paymentToken.tokenAddress,
							amount: minimumOffer,
							bnbPrice,
							ectoPrice,
							solidityFormat: false,
						})}
						)
					</Loading>
				</p>

				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='2rem'
					alignItems='center'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('payment_token', {
									defaultValue: 'Payment Token',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<PaymentTokenSelect
								paymentToken={paymentToken}
								setPaymentToken={setPaymentToken}
							/>
						</div>
					</Grid>
				</Grid>
				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='2rem'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('offer_amount', {
									defaultValue: 'Offer Amount',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Input
								defaultValue={offerAmount}
								required
								onChange={(event) =>
									setOfferAmount(+event.currentTarget.value)
								}
							/>
						</div>
						<span>
							$
							{getTokenPriceInUsd({
								address: paymentToken.tokenAddress,
								amount: offerAmount,
								bnbPrice,
								ectoPrice,
								solidityFormat: false,
							})}
						</span>
					</Grid>
				</Grid>
				<div className='d-flex justify-content-center pt-3'>
					<Translation ready={ready}>
						<div className='button-wrapper'>
							{approved ? (
								<OutlinedButton
									onClick={() =>
										onCreateOffer({
											paymentToken,
											offerAmount,
										})
									}
								>
									<Loading loading={!ready}>
										{t('create_offer', {
											defaultValue: 'Create Offer',
										})}
									</Loading>
								</OutlinedButton>
							) : (
								<OutlinedButton
									onClick={() => {
										approve();
									}}
								>
									<Loading loading={!ready}>
										{t('approve', {
											defaultValue: 'Approve',
										})}
									</Loading>
								</OutlinedButton>
							)}
						</div>
					</Translation>
				</div>
			</div>
		</Modal>
	);
};

export default TokenOfferDialog;
