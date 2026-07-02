import './BuyoutDialog.scss';

import Loading from '../../widgets/Loading';
import Modal from '../../widgets/Modal';
import OutlinedButton from '../../widgets/Button/OutlinedButton';
import { useTranslation } from 'react-i18next';

const BuyoutDialog = ({
	open,
	imageLink,
	onClose,
	onBuyout,
	approved,
	onApprove = () => {},
}: {
	open: boolean;
	imageLink: string;
	onClose: () => void;
	onBuyout: () => {};
	approved: boolean;
	onApprove?: () => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Modals.BuyoutDialog',
	});

	return (
		<Modal open={open} onClose={onClose} className='BuyoutDialog'>
			<div className='BuyoutDialog-Content py-4'>
				<div>
					<img
						src={imageLink}
						alt=''
						height='200px'
						width='200px'
						style={{ objectFit: 'cover', borderRadius: '100%' }}
					/>
				</div>

				<h2 style={{ color: '#fff' }} className='mt-2'>
					<Loading loading={!ready}>
						{t('buyout', { defaultValue: 'Buyout' })}
					</Loading>
				</h2>

				<div className='d-flex justify-content-center pt-3'>
					<div>
						{approved ? (
							<OutlinedButton onClick={() => onBuyout()}>
								<Loading loading={!ready}>
									{t('buyout', {
										defaultValue: 'Buyout',
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
				</div>
			</div>
		</Modal>
	);
};

export default BuyoutDialog;
