import { blockchains } from '../constants/Blockchains';
import { isAddress } from '.';

export const defaultTokenPath = `${process.env.PUBLIC_URL}/images/default-token.png`;

/**
 * HTML img tag onError handler
 * set the img src to a default token image
 * @param event
 *
 * @return {void}
 */
export const onTokenIconNotFound = (event) => {
	event.target.src = process.env.PUBLIC_URL + '/images/default-token.png';
	event.target.onerror = null;
};

/**
 * Image tag that containers onError handler
 * @param {Object} props - Image attributes
 * @param {string} props.src - Image src
 * @param {string} props.className - image class attribute
 *
 * @return {JSX.Element}
 */
export const ImageTag = ({
	id = '',
	src = '',
	className = '',
	height = 'auto',
	width = 'auto',
	alt = 'image',
	title = '',
	style = {},
}: {
	id?: string;
	src: string;
	className?: string;
	height?: string | number;
	width?: string | number;
	alt?: string;
	title?: string;
	style?: any;
}) => {
	className = className || '';

	return (
		<img
			id={id}
			src={src}
			className={`image ${className}`}
			onError={onTokenIconNotFound}
			height={height}
			width={width}
			alt={alt}
			title={title}
			style={style}
		/>
	);
};

/**
 * Get the src for a token from trustwallet
 * @param {string} tokenAddress - Token address
 *
 * @return {string}
 */
export const getTokenIconSrc = (tokenAddress: string) => {
	if (isAddress(tokenAddress)) {
		return (
			'https://assets.trustwalletapp.com/blockchains/smartchain/assets/' +
			isAddress(tokenAddress) +
			'/logo.png'
		);
	} else {
		return process.env.PUBLIC_URL + '/images/default-token.png';
	}
};

/**
 * Token image tag that containers onError handler
 * @param {Object} props - Image attributes
 * @param {string} address - token address
 * @param {string} height - image css height
 * @param {string} width - image css width
 *
 * @return {JSX.Element}
 */
export const TokenImageTag = ({
	address,
	height,
	width,
	alt = 'token',
}: {
	address: any;
	height?: any;
	width?: any;
	alt: string;
}) => {
	if (!height) {
		height = 'auto';
	}
	if (!width) {
		width = 'auto';
	}
	return (
		<img
			src={getTokenIconSrc(address)}
			onError={onTokenIconNotFound}
			height={height}
			width={width}
			alt={alt}
		/>
	);
};

/**
 * Dex image tag that contains onError handler
 * @param {string} height - image css height
 * @param {string} width - image css width
 * @param {string} id - image id
 * @param {string} className - image className
 * @param {string} alt - image alt
 * @param {number} chainID - The blockchain that the token belongs to
 *
 * @return {JSX.Element}
 */
export const DexImageTag = ({
	height = 'auto',
	width = 'auto',
	id = '',
	className = '',
	alt = 'explorer',
	chainID = blockchains.BSC,
}: {
	height?: any;
	width?: any;
	id?: string;
	className?: string;
	alt?: string;
	chainID?: number;
}) => {
	return (
		<ImageTag
			id={id}
			className={className}
			alt={alt}
			src={getDexIconSrc(chainID)}
			height={height}
			width={width}
		/>
	);
};

/**
 * Get the src for an explore source
 * @param {number} chainID - chain ID
 *
 * @return {string}
 */
export const getDexIconSrc = (chainID) => {
	if (!chainID) {
		return defaultIconSrc();
	}
	if (chainID === blockchains.BSC) {
		return process.env.PUBLIC_URL + '/assets/images/dex/pancakeswap.png';
	}
	if (chainID === blockchains.ETHEREUM) {
		return process.env.PUBLIC_URL + '/assets/images/dex/uniswap.png';
	}
	return defaultIconSrc();
};

export const imageSrc = (path) => {
	return process.env.PUBLIC_URL + `/images/${path}`;
};

export const defaultIconSrc = () => {
	return imageSrc('default-token.png');
};
