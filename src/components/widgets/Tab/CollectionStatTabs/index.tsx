import './index.scss';

import { Tab, Tabs } from '@mui/material';

import Loading from '../../Loading';
import { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

const CollectionStatTabs = ({
	tab,
	handleTabChange,
}: {
	tab: number;
	handleTabChange: (
		event: SyntheticEvent<Element, Event>,
		newValue: number
	) => void;
}) => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'widgets.CollectionStatTabs',
	});

	return (
		<Loading loading={!ready} height='50px' width='200px'>
			<Tabs
				value={tab}
				onChange={handleTabChange}
				variant='scrollable'
				scrollButtons
				allowScrollButtonsMobile
				className='widget CollectionStatTabs'
			>
				<Tab label={t('all', { defaultValue: 'All' })} />
				<Tab label={t('last_24_h', { defaultValue: 'Last 24h' })} />
				<Tab label={t('7_days', { defaultValue: '7 days' })} />
				<Tab label={t('30_days', { defaultValue: '30 days' })} />
			</Tabs>
		</Loading>
	);
};

export default CollectionStatTabs;
