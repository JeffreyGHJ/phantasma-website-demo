import './index.scss';

import { useCallback, useEffect, useState } from 'react';

import Loading from '../../widgets/Loading';
import PurpleFilledButton from '../../widgets/Button/FilledButton/PurpleFilledButton';
import PurpleOutlinedButton from '../../widgets/Button/OutlinedButton/PurpleOutlinedButton';
import RouteUtilModel from '../../../models/util_models/RouteUtilModel';
import WalletModal from '../WalletModal/WalletModal';
import { useActiveWeb3React } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWalletModal } from '../../../hooks/useWalletModal';

const ConnectButton = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'Navbar.buttons.ConnectButton',
	});

	const { account } = useActiveWeb3React();
	const [buttonText, setButtonText] = useState('Connect');
	const navigate = useNavigate();
	const {
		isWalletModalOpen,
		handleModalOpen,
		handleModalClose,
		handleWalletClick,
	} = useWalletModal();

	const handleButtonClick = useCallback(() => {
		if (account) {
			navigate(RouteUtilModel.ROUTES.MARKETPLACE.PROFILE.get());
		} else {
			handleModalOpen();
		}
	}, [account, handleModalOpen, navigate]);

	useEffect(() => {
		if (!account) {
			setButtonText('Connect');
		} else {
			setButtonText(`${account.slice(0, 4)}...${account.slice(-2)}`);
		}
	}, [account]);
	return (
		<>
			<PurpleFilledButton
				className='ConnectButton'
				onClick={handleButtonClick}
			>
				<Loading loading={!ready}>
					{buttonText === 'Connect'
						? t('connect_wallet', { defaultValue: 'Connect' })
						: buttonText}
				</Loading>
			</PurpleFilledButton>
			<WalletModal
				open={isWalletModalOpen}
				handleClose={handleModalClose}
				handleWalletClick={handleWalletClick}
			/>
		</>
	);
};

export default ConnectButton;
