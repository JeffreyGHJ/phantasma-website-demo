import './index.scss';

import { Tab, Tabs } from '@mui/material';

import { ImageTag } from '../../../../utils/ImageUtil';
import { SyntheticEvent } from 'react';

const NftTabs = ({
	tab,
	handleTabChange,
}: {
	tab: number;
	handleTabChange: (
		event: SyntheticEvent<Element, Event>,
		newValue: number
	) => void;
}) => {
	return (
		<Tabs
			value={tab}
			onChange={handleTabChange}
			variant='scrollable'
			scrollButtons
			allowScrollButtonsMobile
			className='widget NftTabs'
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
						<span className='label'>Ghosts</span>
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
						<span className='label'>Skeletons</span>
					</div>
				}
			/>
		</Tabs>
	);
};

export default NftTabs;
