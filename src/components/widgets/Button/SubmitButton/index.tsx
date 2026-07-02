import './SubmitButton.scss';

const SubmitButton = (props) => {
	const { children, className, disabled, ...attributes } = props;

	return (
		<button
			className={`widget SubmitButton pill ${
				disabled ? 'disabled' : ''
			} ${className || ''}`}
			type='button'
			{...attributes}
		>
			{children}
		</button>
	);
};

export default SubmitButton;
