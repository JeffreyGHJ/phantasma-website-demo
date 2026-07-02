import { Select } from '@mui/material';

/**
 * @deprecated Directly use Select
 */
const DropdownSelect = (props) => {
	const { children, className, ...attributes } = props;

	return (
		<Select
			id='DropdownSelect'
			className={`widget DropdownSelect ${className || ''}`}
			{...attributes}
		>
			{children}
		</Select>
	);
};

export default DropdownSelect;
