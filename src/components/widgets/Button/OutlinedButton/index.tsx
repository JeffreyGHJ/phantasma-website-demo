import './index.scss';

import PropTypes from 'prop-types';

const OutlinedButton = (props) => {
	const {
		children,
		disabled = false,
		className,
		size,
		...attributes
	} = props;

	return (
		<button
			className={`widget OutlinedButton ${className || ''} ${size || ''}`}
			disabled={disabled}
			{...attributes}
		>
			{children}
		</button>
	);
};

OutlinedButton.propTypes = {
	id: PropTypes.string,
	children: PropTypes.any.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string,
	disabled: PropTypes.bool,
	size: PropTypes.string,
};

export default OutlinedButton;
