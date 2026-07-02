import PropTypes from 'prop-types';
import { Skeleton } from '@mui/material';

const Loading = (props) => {
	const {
		children,
		loading,
		width,
		height,
		multiple = 1,
		className,
	}: {
		children: any;
		loading: boolean;
		width: string;
		height: string;
		multiple: number;
		className?: string;
	} = props;
	return (
		<>
			{!loading ? (
				children
			) : (
				<>
					{[...Array(multiple)]
						.map((x) => 0)
						.map((value, index) => {
							return (
								<Skeleton
									className={className || ''}
									key={index}
									animation='wave'
									width={width || '60px'}
									height={height || '100%'}
								/>
							);
						})}
				</>
			)}
		</>
	);
};

Loading.propTypes = {
	children: PropTypes.any,
	loading: PropTypes.bool.isRequired,
	width: PropTypes.string,
	height: PropTypes.string,
	multiple: PropTypes.number,
	className: PropTypes.string,
};

export default Loading;
