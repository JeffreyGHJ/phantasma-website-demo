import './index.scss';

import { Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import FavoriteArmories from './Armory';
import FavoriteGhosts from './Ghosts';
import FavoritePets from './Pets';
import FavoriteSupplies from './Supplies';
import { ImageTag } from '../../../../utils/ImageUtil';
import Loading from '../../../widgets/Loading';
import NotSignInAlert from '../../../widgets/Alert/NotSignInAlert';
import RouteUtilModel from '../../../../models/util_models/RouteUtilModel';
import usePageTitle from '../../../../hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../../state/application/hooks';

const CATEGORY_ROUTES_TAB_MAP = RouteUtilModel.CATEGORY_ROUTES_TAB_MAP;

const CategoryContent = ({ tab }: { tab: number }) => {
	switch (tab) {
		case CATEGORY_ROUTES_TAB_MAP.ghosts: {
			return <FavoriteGhosts />;
		}
		case CATEGORY_ROUTES_TAB_MAP.pets: {
			return <FavoritePets />;
		}
		case CATEGORY_ROUTES_TAB_MAP.armory: {
			return <FavoriteArmories />;
		}
		case CATEGORY_ROUTES_TAB_MAP.supplies: {
			return <FavoriteSupplies />;
		}
		default:
			return <FavoriteGhosts />;
	}
};

const Favorites = () => {
	usePageTitle('Favorites | Phantasma');
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'AssetCategories',
	});

	const user = useUser();
	const { asset } = useParams();
	const navigate = useNavigate();
	const [tab, setTab] = useState(
		CATEGORY_ROUTES_TAB_MAP[asset || ''] || CATEGORY_ROUTES_TAB_MAP.ghosts
	);

	const handleTabChange = (event, newValue) => {
		navigate(
			`${RouteUtilModel.ROUTES.MARKETPLACE.PROFILE.FAVORITES.get()}/${
				RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[newValue]
			}`
		);
	};

	useEffect(() => {
		if (asset && navigate && !(asset in CATEGORY_ROUTES_TAB_MAP)) {
			navigate(
				RouteUtilModel.ROUTES.MARKETPLACE.PROFILE.FAVORITES.GHOSTS.get()
			);
		}
	}, [asset, navigate]);

	useEffect(() => {
		if (asset) {
			setTab(CATEGORY_ROUTES_TAB_MAP[asset]);
		}
	}, [asset]);

	return (
		<div id='Favorites'>
			{!user && <NotSignInAlert />}
			<section className='category-section'>
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
									<Loading loading={!ready}>
										{t('ghosts', {
											defaultValue: 'Ghosts',
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
									src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
									height='auto'
									width='22px'
									alt='Pets'
								/>
								<span className='label'>
									<Loading loading={!ready}>
										{t('pets', {
											defaultValue: 'Pets',
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
									src={`${process.env.PUBLIC_URL}/assets/images/icons/Sword.png`}
									height='auto'
									width='22px'
									alt='Armory'
								/>
								<span className='label'>
									<Loading loading={!ready}>
										{t('armory', {
											defaultValue: 'Armory',
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
									src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
									height='auto'
									width='22px'
									alt='ghosts'
								/>
								<span className='label'>
									<Loading loading={!ready}>
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
									alt='Multipliers'
								/>
								<span className='label'>
									<Loading loading={!ready}>
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
				<CategoryContent tab={tab} />
			</section>
		</div>
	);
};

export default Favorites;
