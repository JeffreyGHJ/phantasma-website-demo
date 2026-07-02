import './DropdownMenu.scss';

import { Menu } from '@mui/material';

const DropdownMenu = (props) => {
	const { children, className, ...attributes } = props;

	return (
		<Menu
			className={`widget DropdownMenu ${className || ''}`}
			{...attributes}
		>
			{children}
		</Menu>
	);
};

export default DropdownMenu;
