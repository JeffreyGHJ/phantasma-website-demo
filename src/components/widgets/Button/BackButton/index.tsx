import './index.scss';

import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

const BackButton = ({ to, label }: { to: string; label?: ReactNode }) => {
	return (
		<div className='widget BackButton'>
			<Link to={to} className='link'>
				<div className='arrow'>←</div>
				<div className='label'>{label}</div>
			</Link>
		</div>
	);
};

export default BackButton;
