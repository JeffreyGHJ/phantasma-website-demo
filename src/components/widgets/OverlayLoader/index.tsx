import './index.scss';

const OverlayLoader = ({ show }: { show: boolean }) => {
	return show ? (
		<div className='widget OverlayLoader'>
			<div className='loader'></div>
		</div>
	) : (
		<></>
	);
};

export default OverlayLoader;
