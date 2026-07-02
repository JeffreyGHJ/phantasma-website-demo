import './index.scss';

import PropTypes from 'prop-types';

const RadioCheckbox = (props) => {
	const { checked, onChange, className, ...attributes } = props;
	return (
		<div
			className={`widget RadioCheckbox ${checked ? 'checked' : ''}`}
			{...attributes}
			onClick={() => {
				onChange(!checked);
			}}
		>
			<div className='inner'></div>
		</div>
	);
};

RadioCheckbox.propTypes = {
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func,
	className: PropTypes.string,
};

export default RadioCheckbox;
