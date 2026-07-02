import './index.scss';

import { Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ImageTag } from '../../../utils/ImageUtil';
import Loading from '../../widgets/Loading';
import QuickSetting from '../../widgets/SpeedDial/QuickSetting';
import RouteUtilModel from '../../../models/util_models/RouteUtilModel';
import WalletArmories from './Armory';
import WalletGhosts from './Ghosts';
import WalletPets from './Pets';
import WalletSupplies from './Supplies';
import { useTranslation } from 'react-i18next';

const CategoryContent = ({
	tab,
	address,
}: {
	tab: number;
	address: string;
}) => {
	switch (tab) {
		case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts: {
			return <WalletGhosts address={address} />;
		}
		case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.pets: {
			return <WalletPets address={address} />;
		}
		case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.armory: {
			return <WalletArmories address={address} />;
		}
		case RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.supplies: {
			return <WalletSupplies address={address} />;
		}
		default:
			return <WalletGhosts address={address} />;
	}
};

const Wallet = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'AssetCategories',
	});
	const { asset, address } = useParams();
	const navigate = useNavigate();
	const [tab, setTab] = useState(
		RouteUtilModel.CATEGORY_ROUTES_TAB_MAP[asset || ''] ||
			RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts
	);

	const handleTabChange = (event, newValue) => {
		navigate(
			`/wallet/${address}/${RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[newValue]}`
		);
	};

	useEffect(() => {
		if (asset) {
			setTab(RouteUtilModel.CATEGORY_ROUTES_TAB_MAP[asset]);
		}
	}, [asset]);

	useEffect(() => {
		if (
			asset &&
			!(asset in RouteUtilModel.CATEGORY_ROUTES_TAB_MAP) &&
			address
		) {
			navigate(`/wallet/${address}/ghosts`);
		}
	}, [asset, address, navigate]); //asset and navigate are already defined in the beginning

	return (
		<div id='Wallet'>
			<Tabs
				value={tab}
				onChange={handleTabChange}
				variant='scrollable'
				scrollButtons
				allowScrollButtonsMobile
				className='CategoryTabs'
			>
				<Tab
					label={
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Ghosts.png`}
								height='auto'
								width='22px'
								alt='ghosts'
							/>

							<span className='label'>
								<Loading loading={!ready} width='40px'>
									{t('ghosts', { defaultValue: 'Ghosts' })}
								</Loading>
							</span>
						</div>
					}
				/>
				<Tab
					label={
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
								height='auto'
								width='22px'
								alt='pets'
							/>
							<span className='label'>
								<Loading loading={!ready} width='40px'>
									{t('pets', { defaultValue: 'Pets' })}
								</Loading>
							</span>
						</div>
					}
				/>
				<Tab
					label={
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
								height='auto'
								width='22px'
								alt='armory'
							/>
							<span className='label'>
								<Loading loading={!ready} width='40px'>
									{t('armory', { defaultValue: 'Armory' })}
								</Loading>
							</span>
						</div>
					}
				/>
				<Tab
					label={
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
								height='auto'
								width='22px'
								alt='supplies'
							/>
							<span className='label'>
								<Loading loading={!ready} width='40px'>
									{t('supplies', {
										defaultValue: 'Supplies',
									})}
								</Loading>
							</span>
						</div>
					}
				/>
				<Tab
					label={
						<div className='tab'>
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/Scrolls.png`}
								height='auto'
								width='22px'
								alt='ghosts'
							/>
							<span className='label'>
								<Loading loading={!ready} width='40px'>
									{t('multipliers', {
										defaultValue: 'Multipliers',
									})}
								</Loading>
							</span>
						</div>
					}
					disabled
				/>
			</Tabs>
			{address && <CategoryContent tab={tab} address={address} />}
			<QuickSetting />
		</div>
	);
};

export default Wallet;
