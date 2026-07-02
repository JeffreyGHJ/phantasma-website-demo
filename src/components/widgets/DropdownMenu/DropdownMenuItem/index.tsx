import './DropdownMenuItem.scss';

import { MenuItem } from '@mui/material';

const DropdownMenuItem = (props) => {
	const { children, className, ...attributes } = props;
	return (
		<MenuItem
			className={`widget DropdownMenuItem ${className || ''}`}
			{...attributes}
		>
			{children}
		</MenuItem>
	);
};

export default DropdownMenuItem;
