import './index.scss';

import Input from '../../widgets/Input';
import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import { useBnbPriceInUsd } from '../../../state/application/hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ListItemDialog = ({
	open,
	imageLink,
	onClose,
	onList,
	approved,
	onApprove = () => {},
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	onList: (listPrice) => void;
	approved: boolean;
	onApprove?: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.ListItemDialog',
	});

	const [listPrice, setListPrice] = useState(0);
	const bnbPrice = useBnbPriceInUsd();

	const getBnbPriceInUsd = (amount: number) => {
		return (bnbPrice * amount).toFixed(2);
	};

	return (
		<Modal open={open} onClose={onClose} className='ListItemDialog'>
			<div className='ListItemDialog-Content'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='200px'
						width='200px'
						style={{ objectFit: 'cover', borderRadius: '100%' }}
					/>
				</div>

				<h2>
					<Loading loading={!ready}>
						{t('title', { defaultValue: 'Sell Now' })}{' '}
					</Loading>
				</h2>

				<p className='mx-2 description'>
					<Loading loading={!ready} width='250px' height='40px'>
						{t('description', {
							defaultValue:
								'Enter BNB amount below, but make sure it is right before you list!',
						})}
					</Loading>
				</p>

				<div className='input-field mt-4'>
					<div className='align-self-center'>
						<Input
							required
							onChange={(event) =>
								setListPrice(+event.currentTarget.value)
							}
						/>
						<div className='white'>
							${getBnbPriceInUsd(listPrice)}
						</div>
					</div>

					<div className='button-wrapper'>
						{approved ? (
							<OutlinedButton onClick={() => onList(listPrice)}>
								<Loading loading={!ready}>
									{t('sell', { defaultValue: 'Sell' })}
								</Loading>
							</OutlinedButton>
						) : (
							<OutlinedButton onClick={() => onApprove()}>
								<Loading loading={!ready}>
									{t('approve', { defaultValue: 'Approve' })}
								</Loading>
							</OutlinedButton>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ListItemDialog;
