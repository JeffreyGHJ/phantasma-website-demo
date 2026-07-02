import './index.scss';

import {
	fromSolidityTokenFormat,
	solidityTokenFormat,
} from '../../../utils/MathUtil';
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
import { useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import { Grid } from '@mui/material';
import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OfferABI from '../../../constants/abis/OfferABI';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PaymentTokenSelect from '../../widgets/Select/PaymentTokenSelect';
import Web3 from 'web3';
import { activeNode } from '../../../constants/Nodes';
import { littleGhostsOfferContractAddress } from '../../../constants/ContractAddresses';
import { paymentTokens } from '../../../constants/constant';
import { useContract } from '../../../hooks/useContract';
import { useTranslation } from 'react-i18next';

const web3 = new Web3(activeNode);

const MinimumOfferDialog = ({
	open,
	imageLink,
	onClose,
	item,
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	item: any;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.MinimumOfferDialog',
	});

	const [minimumOffer, setMinimumOffer] = useState(0);
	const [paymentToken, setPaymentToken] = useState(paymentTokens[0]);
	const [newMinimumOfferAmount, setNewMinimumOfferAmount] = useState(0);
	const ectoPrice = useEctoPriceInUsd();
	const bnbPrice = useBnbPriceInUsd();

	const offerContract = useContract(
		littleGhostsOfferContractAddress,
		OfferABI
	);

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

	const createNewMinimumOffer = async () => {
		const _paymentToken = paymentToken;
		await offerContract
			?.setMinimumOfferByCollectionAndId(
				item.address,
				item.id,
				paymentToken.tokenAddress,
				solidityTokenFormat(
					newMinimumOfferAmount,
					_paymentToken.decimals
				)
			)
			.then((res, rej) => {
				handleWeb3Reponse({
					waitingMessage: `Waiting for confirmations to set minimum offer for #${item.id}`,
					successMessage: `Minimum offer is successfully set for #${item.id}.`,
					res,
					callback: async () => {
						getMinimumOffers(item, _paymentToken.tokenAddress);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	useEffect(() => {
		if (!item || !item.address || !item.id || !paymentToken) {
			return;
		}
		getMinimumOffers(item, paymentToken.tokenAddress).then((_minimum) => {
			setMinimumOffer(_minimum);
		});
	}, [paymentToken, item]);

	useEffect(() => {}, []);

	return (
		<Modal className='MinimumOfferDialog' open={open} onClose={onClose}>
			<div className='MinimumOfferDialog-Content scrollbar'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='176'
						width='176'
						style={{
							objectFit: 'cover',
							borderRadius: '100%',
						}}
					/>
				</div>

				<h2>
					<Loading loading={!ready}>
						{t('title', { defaultValue: 'Minimum Offer' })}{' '}
					</Loading>
				</h2>

				<p>
					<Loading loading={!ready}>
						{t('min', { defaultValue: 'Min.' })}:{' '}
						{minimumOffer.toLocaleString()} {paymentToken.name} ($
						{getTokenPriceInUsd({
							address: paymentToken.tokenAddress,
							amount: minimumOffer,
							ectoPrice,
							bnbPrice,
							solidityFormat: false,
						})}
						)
					</Loading>
				</p>

				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='1rem'
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
					alignItems='center'
				>
					<Grid item style={{ alignSelf: 'center' }}>
						<h3>
							<Loading loading={!ready}>
								{t('minimum_offer', {
									defaultValue: 'Minimum Offer',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Input
								defaultValue={newMinimumOfferAmount}
								required
								onChange={(event) =>
									setNewMinimumOfferAmount(
										+event.currentTarget.value
									)
								}
							/>
						</div>
						<span>
							$
							{getTokenPriceInUsd({
								address: paymentToken.tokenAddress,
								amount: newMinimumOfferAmount,
								ectoPrice,
								bnbPrice,
								solidityFormat: false,
							})}
						</span>
					</Grid>
				</Grid>
				<div className='d-flex justify-content-center pt-3'>
					<div className='button-wrapper'>
						<OutlinedButton onClick={() => createNewMinimumOffer()}>
							<Loading loading={!ready}>
								{t('set_min_offer', {
									defaultValue: 'Set Min. Offer',
								})}
							</Loading>
						</OutlinedButton>
					</div>
				</div>
			</div>
		</Modal>
	);
};
export default MinimumOfferDialog;
