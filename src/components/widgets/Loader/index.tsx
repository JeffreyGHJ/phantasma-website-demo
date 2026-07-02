import './index.scss';

const Loader = ({ show }: { show: boolean }) => {
	return show ? <div className='widget Loader'></div> : <></>;
};

export default Loader;
