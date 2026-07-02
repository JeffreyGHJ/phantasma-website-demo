import './index.scss';

import PropTypes from 'prop-types';

const RightDrawerSidebar = (props) => {
	const { className, children, ...attributes } = props;
	return (
		<nav
			className={`widget RightDrawerSidebar scrollbar ${className || ''}`}
			{...attributes}
		>
			{children}
		</nav>
	);
};

RightDrawerSidebar.propTypes = {
	id: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.any,
};

export default RightDrawerSidebar;
