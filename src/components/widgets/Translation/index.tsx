import { Skeleton } from '@mui/material';

/**
 * @deprecated Use <Loading>
 */
const Translation = (props) => {
	const {
		children,
		ready,
		width,
		height,
		multiple = 1,
	}: {
		children: any;
		ready: boolean;
		width: string;
		height: string;
		multiple: number;
	} = props;
	return (
		<>
			{ready ? (
				children
			) : (
				<>
					{[...Array(multiple)]
						.map((x) => 0)
						.map((value, index) => {
							return (
								<Skeleton
									key={index}
									animation='wave'
									width={width || '50%'}
									height={height || '100%'}
								/>
							);
						})}
				</>
			)}
		</>
	);
};

export default Translation;
