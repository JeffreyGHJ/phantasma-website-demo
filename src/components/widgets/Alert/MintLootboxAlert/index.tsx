import './index.scss';

import { SyntheticEvent, useCallback } from 'react';
import {
	useHideLootboxMintAlert,
	useUpdateHideLootboxMintAlert,
} from '../../../../state/lootbox/lootbox.hooks';

import { Alert } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import Loading from '../../Loading';
import RouteUtilModel from '../../../../models/util_models/RouteUtilModel';
import { useHasSaleStarted } from '../../../../constants/abis/bsc/LootboxABI/hooks/useHasSaleStarted';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const MintLootboxAlert = ({ className = '' }: { className?: string }) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.MintLootboxAlert',
	});

	const hideLootboxMintAlert = useHideLootboxMintAlert();
	const updateHideLootboxMintAlert = useUpdateHideLootboxMintAlert();
	const hasSaleStarted = useHasSaleStarted();

	const navigate = useNavigate();

	const handleOnClick = useCallback(() => {
		navigate(RouteUtilModel.ROUTES.MINT.get());
	}, [navigate]);

	const handleOnClose = useCallback(
		(evt: SyntheticEvent<Element, Event>) => {
			evt.stopPropagation();
			updateHideLootboxMintAlert(true);
		},
		[updateHideLootboxMintAlert]
	);

	return hasSaleStarted && !hideLootboxMintAlert ? (
		<div
			className={`widget MintLootboxAlert ${className}`}
		>
			<Alert severity='info' onClose={handleOnClose}>
				<Loading loading={!ready}>
					<div className='d-flex align-items-center flex-wrap gap-2'>
						<div>
							The marketplace will soon be moved to Phantasma. We recommend you list on https://ghostswap.finance to enjoy 0.5% fees.
						</div>
						<div>
							<EastIcon fontSize='small' />
						</div>
					</div>
				</Loading>
			</Alert>
		</div>
	) : (
		<></>
	);
};

export default MintLootboxAlert;
