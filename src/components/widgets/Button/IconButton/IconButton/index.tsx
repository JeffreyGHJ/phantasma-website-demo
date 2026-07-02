import './index.scss';

import { IconButton as MuiIconButton } from '@mui/material';
import PropTypes from 'prop-types';

const IconButton = (props) => {
	const { children, className, ...attributes } = props;

	return (
		<MuiIconButton
			className={`widget IconButton ${className || ''}`}
			{...attributes}
		>
			{children}
		</MuiIconButton>
	);
};

IconButton.propTypes = {
	id: PropTypes.string,
	children: PropTypes.any.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func,
	'aria-controls': PropTypes.string,
	'aria-haspopup': PropTypes.string,
	'aria-expanded': PropTypes.string,
	title: PropTypes.string,
};

export default IconButton;
