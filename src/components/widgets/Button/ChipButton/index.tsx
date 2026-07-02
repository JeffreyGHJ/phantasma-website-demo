import './index.scss';

import PropTypes from 'prop-types';

const ChipButton = (props) => {
	const { className, children, Icon, label, ...attributes } = props;
	return (
		<button
			className={`widget ChipButton ${className || ''}`}
			{...attributes}
		>
			<div className='icon'>{Icon}</div>
			<div className='label'>{label}</div>
		</button>
	);
};

ChipButton.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
	Icon: PropTypes.element.isRequired,
	label: PropTypes.string.isRequired,
};

export default ChipButton;
