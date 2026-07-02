const ExternalLink = (props) => {
	const { href, className, children } = props;
	return (
		<a
			href={href}
			className={`external-link ${className || ''}`}
			target='_blank'
			rel='noopener noreferrer'
		>
			{children}
		</a>
	);
};

export default ExternalLink;
