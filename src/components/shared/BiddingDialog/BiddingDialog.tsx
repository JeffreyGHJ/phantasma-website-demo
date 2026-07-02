import './BiddingDialog.scss';

import {
	useBnbPriceInUsd,
	useEctoPriceInUsd,
} from '../../../state/application/hooks';
import { useMemo, useState } from 'react';

import { Grid } from '@mui/material';
import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import PaymentTokenSelect from '../../widgets/Select/PaymentTokenSelect';
import Translation from '../../widgets/Translation';
import { getTokenPriceInUsd } from '../../../utils/funcs';
import { paymentTokens } from '../../../constants/constant';
import { useTranslation } from 'react-i18next';

const BiddingDialog = ({
	open,
	imageLink,
	onClose,
	onBidding,
	paymentToken,
	approved,
	onApprove = () => {},
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	onBidding: ({ bidAmount }) => {};
	paymentToken: string;
	approved: boolean;
	onApprove?: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.BiddingDialog',
	});

	const [bidAmount, setBidAmount] = useState(0);
	const ectoPrice = useEctoPriceInUsd();
	const bnbPrice = useBnbPriceInUsd();

	const _paymentToken = useMemo(() => {
		return paymentTokens.find(
			(x) => x.tokenAddress === paymentToken.toLowerCase()
		);
	}, [paymentToken]);

	if (!_paymentToken) {
		return <div></div>;
	}

	return (
		<Modal open={open} onClose={onClose} className='BiddingDialog'>
			<div className='BiddingDialog-Content py-4'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='200px'
						width='200px'
						style={{ objectFit: 'cover', borderRadius: '100%' }}
					/>
				</div>

				<h2 className='mt-3'>
					<Loading loading={!ready}>
						{t('bid', { defaultValue: 'Bid' })}
					</Loading>
				</h2>

				<Grid
					container
					justifyContent='space-between'
					className='pt-4'
					gap='2rem'
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
								paymentToken={_paymentToken}
								disabled={true}
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
								{t('bid_amount', {
									defaultValue: 'Bid Amount',
								})}
							</Loading>
						</h3>
					</Grid>
					<Grid item>
						<div>
							<Input
								required
								onChange={(event) =>
									setBidAmount(+event.currentTarget.value)
								}
							/>
						</div>
						<span>
							$
							{getTokenPriceInUsd({
								address: paymentToken,
								amount: bidAmount,
								ectoPrice,
								bnbPrice,
								solidityFormat: false,
							})}
						</span>
					</Grid>
				</Grid>
				<div className='d-flex justify-content-center pt-3'>
					<Translation ready={ready}>
						<div>
							{approved ? (
								<OutlinedButton
									onClick={() =>
										onBidding({
											bidAmount,
										})
									}
								>
									<Loading loading={!ready}>
										{t('submit_bid', {
											defaultValue: 'Submit Bid',
										})}
									</Loading>
								</OutlinedButton>
							) : (
								<OutlinedButton onClick={() => onApprove()}>
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

export default BiddingDialog;
