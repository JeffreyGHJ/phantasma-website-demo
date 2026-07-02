import './index.scss';

import { Link } from 'react-router-dom';

const InternalLink = (props) => {
	const { className, children, ...attributes } = props;
	return (
		<Link
			className={`widget InternalLink ${className || ''}`}
			{...attributes}
		>
			{children}
		</Link>
	);
};

export default InternalLink;
