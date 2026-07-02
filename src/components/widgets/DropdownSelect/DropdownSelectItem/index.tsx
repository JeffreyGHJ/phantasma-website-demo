import { MenuItem } from '@mui/material';

/**
 * @deprecated Directly use MenuItem
 */
const DropdownSelectItem = (props) => {
	const { children, className, ...attributes } = props;
	return (
		<MenuItem
			className={`widget DropdownSelectItem ${className || ''}`}
			{...attributes}
		>
			{children}
		</MenuItem>
	);
};

export default DropdownSelectItem;
