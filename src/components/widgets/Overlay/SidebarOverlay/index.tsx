import './index.scss';

import PropTypes from 'prop-types';

const SidebarOverlay = (props) => {
	const { className, children, ...attributes } = props;
	return (
		<div
			className={`widget SidebarOverlay ${className || ''}`}
			{...attributes}
		></div>
	);
};

SidebarOverlay.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.any,
	className: PropTypes.string,
};

export default SidebarOverlay;
