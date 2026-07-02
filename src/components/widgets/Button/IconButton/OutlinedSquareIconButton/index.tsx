import './index.scss';

import PropTypes from 'prop-types';

const OutlinedSquareIconButton = (props) => {
	const { children, className, ...attributes } = props;

	return (
		<button
			className={`widget OutlinedSquareIconButton ${className || ''}`}
			{...attributes}
		>
			{children}
		</button>
	);
};

OutlinedSquareIconButton.propTypes = {
	id: PropTypes.string,
	children: PropTypes.any.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string,
};

export default OutlinedSquareIconButton;
