import './index.scss';

import ExternalLink from '../../ExternalLink/ExternalLink';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import WallpaperIcon from '@mui/icons-material/Wallpaper';

const GalleryButton = (props) => {
	const { address, children, className, ...attributes } = props;
	return (
		<ExternalLink
			href={`https://littleghosts.com:2096/gallery/?address=${address}`}
			className={`widget GalleryButton ${className || ''}`}
			{...attributes}
		>
			<IconButton className='icon-button'>
				<WallpaperIcon />
			</IconButton>
		</ExternalLink>
	);
};

GalleryButton.propTypes = {
	address: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default GalleryButton;
