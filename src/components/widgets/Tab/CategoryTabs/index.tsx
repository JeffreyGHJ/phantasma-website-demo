import './index.scss';

import { Tab, Tabs } from '@mui/material';

import { ImageTag } from '../../../../utils/ImageUtil';
import Loading from '../../Loading';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

const CategoryTabs = ({
	tab,
	handleTabChange,
	Prepends,
}: {
	tab: number;
	handleTabChange: (
		event: SyntheticEvent<Element, Event>,
		newValue: number
	) => void;
	Prepends?: JSX.Element;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'AssetCategories',
	});

	return (
		<Tabs
			value={tab}
			onChange={handleTabChange}
			variant='scrollable'
			scrollButtons
			allowScrollButtonsMobile
			className='widget CategoryTabs'
		>
			{Prepends && Prepends}
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
				disabled={true}
			/>
			<Tab
				label={
					<div className='tab'>
						<ImageTag
							src={`${process.env.PUBLIC_URL}/assets/images/icons/Potion.png`}
							height='auto'
							width='22px'
							alt='Supplies'
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
				disabled={true}
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
				disabled={true}
			/>
		</Tabs>
	);
};

export default CategoryTabs;
