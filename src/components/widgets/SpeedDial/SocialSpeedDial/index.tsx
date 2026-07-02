import './index.scss';

import AssetUtilModel from '../../../../models/util_models/AssetUtilModel';
import { ImageTag } from '../../../../utils/ImageUtil';
import LINKS from '../../../../constants/links';
import ShareIcon from '@mui/icons-material/Share';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';

const openInNewTab = (url: string) => {
	window.open(url, '_blank', 'noopener,noreferrer');
};

const actions = [
	{
		icon: (
			<ImageTag
				src={`${AssetUtilModel.LOGO_PATH}/socials/filled/twitter.svg`}
				height='auto'
			/>
		),
		name: 'Twitter',
		link: LINKS.TWITTER,
	},
	{
		icon: (
			<ImageTag
				src={`${AssetUtilModel.LOGO_PATH}/socials/filled/discord.svg`}
				height='auto'
			/>
		),
		name: 'Discord',
		link: LINKS.DISCORD,
	},
	{
		icon: (
			<ImageTag
				className='round'
				src={`${AssetUtilModel.LOGO_PATH}/socials/filled/telegram.png`}
				width='32px'
				height='auto'
			/>
		),
		name: 'Telegram',
		link: LINKS.TELEGRAM,
	},
	{
		icon: (
			<ImageTag
				className='round'
				src={`${AssetUtilModel.LOGO_PATH}/socials/filled/twitch.png`}
				width='32px'
				height='auto'
			/>
		),
		name: 'Twitch',
		link: LINKS.TWITCH,
	},
	{
		icon: (
			<ImageTag
				className='round'
				src={`${AssetUtilModel.ICON_PATH}/token_icons/Ecto.png`}
				width='32px'
				height='auto'
			/>
		),
		name: 'ECTO Token',
		link: LINKS.PANCAKESWAP_ECTO,
	},
];

const SocialSpeedDial = () => {
	return (
		<div className='widget SocialSpeedDial'>
			<SpeedDial
				className='main-button'
				ariaLabel='SpeedDial'
				sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
				icon={<ShareIcon />}
			>
				{actions.reverse().map((action) => (
					<SpeedDialAction
						className='social'
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={() => {
							openInNewTab(action.link);
						}}
					/>
				))}
			</SpeedDial>
		</div>
	);
};

export default SocialSpeedDial;
