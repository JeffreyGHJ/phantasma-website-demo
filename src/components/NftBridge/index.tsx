import './index.scss';

import {
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	FormGroup,
	Grid,
	LinearProgress,
	TextField,
} from '@mui/material';
import {
	avaxBridgeContractAddress,
	avaxBridgedEctoSkeletonTokenAddress,
	avaxBridgedLittleGhostTokenAddress,
	bscBridgeContractAddress,
	croBridgeContractAddress,
	croBridgedEctoSkeletonTokenAddress,
	croBridgedLittleGhostTokenAddress,
	ectoSkeletonNFTAddress,
	ethBridgeContractAddress,
	ethBridgedEctoSkeletonTokenAddress,
	ethBridgedLittleGhostTokenAddress,
	ftmBridgeContractAddress,
	ftmBridgedEctoSkeletonTokenAddress,
	ftmBridgedLittleGhostTokenAddress,
	littleGhostNFTAddress,
	maticBridgeContractAddress,
	maticBridgedEctoSkeletonTokenAddress,
	maticBridgedLittleGhostTokenAddress,
	oneBridgeContractAddress,
	oneBridgedEctoSkeletonTokenAddress,
	oneBridgedLittleGhostTokenAddress,
} from '../../constants/ContractAddresses';
import {
	blockchainNames,
	blockchains,
	supportedNetworks,
} from '../../constants/Blockchains';
import {
	fetchCollectionItemsByAddress,
	fetchSwapsBySender,
} from '../../apis/web/web.api';
import {
	handleWeb3Error,
	handleWeb3Reponse,
} from '../../utils/Web3ResponseUtil';
import { useEffect, useState } from 'react';

import { AbiItem } from 'web3-utils';
import DropdownSelect from '../widgets/DropdownSelect';
import DropdownSelectItem from '../widgets/DropdownSelect/DropdownSelectItem';
import ExternalLink from '../widgets/ExternalLink/ExternalLink';
import IconButton from '../widgets/Button/IconButton/IconButton';
import { ImageTag } from '../../utils/ImageUtil';
import Loading from '../widgets/Loading';
import OutlinedButton from '../widgets/Button/OutlinedButton';
import QuickSetting from '../widgets/SpeedDial/QuickSetting';
import RefreshIcon from '@mui/icons-material/Refresh';
import Swap from './types/Swap';
import { TESTNET } from '../../constants/global';
import Translation from '../widgets/Translation';
import Web3 from 'web3';
import { activeNodes } from '../../constants/Nodes';
import bridgeABI from '../../constants/abis/bridgeABI';
import bridgedErc721ABI from '../../constants/abis/erc721ABI';
import cogoToast from 'cogo-toast';
import { collectionItemImageUrl } from '../../utils/collectionitemUtils';
import { displayUntilLength } from '../../utils/StringUtil';
import { toastOptions } from '../../configs/CogoToast';
import { useActiveWeb3React } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { useView3d } from '../../state/application/hooks';

declare let window: any;

const web3Bsc = new Web3(activeNodes[blockchains.BSC]);
const web3Eth = new Web3(activeNodes[blockchains.ETHEREUM]);
const web3Cro = new Web3(activeNodes[blockchains.CRONOS]);
const web3Ftm = new Web3(activeNodes[blockchains.FANTOM]);
const web3Avax = new Web3(activeNodes[blockchains.AVALANCHE]);
const web3Matic = new Web3(activeNodes[blockchains.POLYGON]);
const web3One = new Web3(activeNodes[blockchains.HARMONY]);

const COLLECTION_IDS = {
	LITTLEGHOST: 1,
	ECTOSKELETON: 2,
};

const BRIDGE_ADDRESSES = {
	[blockchains.BSC]: bscBridgeContractAddress,
	[blockchains.ETHEREUM]: ethBridgeContractAddress,
	[blockchains.CRONOS]: croBridgeContractAddress,
	[blockchains.FANTOM]: ftmBridgeContractAddress,
	[blockchains.AVALANCHE]: avaxBridgeContractAddress,
	[blockchains.POLYGON]: maticBridgeContractAddress,
	[blockchains.HARMONY]: oneBridgeContractAddress,
};

const NATIVE_TOKEN_UNITS = {
	[blockchains.BSC]: 'BNB',
	[blockchains.ETHEREUM]: 'ETH',
	[blockchains.CRONOS]: 'CRO',
	[blockchains.FANTOM]: 'FTM',
	[blockchains.AVALANCHE]: 'AVAX',
	[blockchains.POLYGON]: 'MATIC',
	[blockchains.HARMONY]: 'ONE',
};

const EXPLORER_LINKS = {
	ADDRESS: {
		[blockchains.BSC]: TESTNET
			? 'https://testnet.bscscan.com/address'
			: 'https://bscscan.com/address',
		[blockchains.ETHEREUM]: TESTNET
			? 'https://rinkeby.etherscan.io/address'
			: 'https://etherscan.io/address',
		[blockchains.CRONOS]: TESTNET
			? 'https://cronos.org/explorer/testnet3/address'
			: 'https://cronoscan.com/address',
		[blockchains.FANTOM]: TESTNET
			? 'https://testnet.ftmscan.com/address'
			: 'https://ftmscan.com/address',
		[blockchains.AVALANCHE]: TESTNET
			? 'https://testnet.snowtrace.io/address'
			: 'https://snowtrace.io/address',
		[blockchains.POLYGON]: TESTNET
			? 'https://mumbai.polygonscan.com/address'
			: 'https://polygonscan.com/address',
		[blockchains.HARMONY]: TESTNET
			? 'https://explorer.pops.one/address'
			: 'https://explorer.harmony.one/address',
	},
	TRANSACTIONS: {
		[blockchains.BSC]: TESTNET
			? 'https://testnet.bscscan.com/tx'
			: 'https://bscscan.com/tx',
		[blockchains.ETHEREUM]: TESTNET
			? 'https://rinkeby.etherscan.io/tx'
			: 'https://etherscan.io/tx',
		[blockchains.CRONOS]: TESTNET
			? 'https://cronos.org/explorer/testnet3/tx'
			: 'https://cronoscan.com/tx',
		[blockchains.FANTOM]: TESTNET
			? 'https://testnet.ftmscan.com/tx'
			: 'https://ftmscan.com/tx',
		[blockchains.AVALANCHE]: TESTNET
			? 'https://testnet.snowtrace.io/tx'
			: 'https://snowtrace.io/tx',
		[blockchains.POLYGON]: TESTNET
			? 'https://mumbai.polygonscan.com/tx'
			: 'https://polygonscan.com/tx',
		[blockchains.HARMONY]: TESTNET
			? 'https://explorer.pops.one/tx'
			: 'https://explorer.harmony.one/tx',
	},
};

const COLLECTION_ADDRESSES = {
	[blockchains.BSC]: {
		[COLLECTION_IDS.LITTLEGHOST]: littleGhostNFTAddress,
		[COLLECTION_IDS.ECTOSKELETON]: ectoSkeletonNFTAddress,
	},
	[blockchains.ETHEREUM]: {
		[COLLECTION_IDS.LITTLEGHOST]: ethBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: ethBridgedEctoSkeletonTokenAddress,
	},
	[blockchains.CRONOS]: {
		[COLLECTION_IDS.LITTLEGHOST]: croBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: croBridgedEctoSkeletonTokenAddress,
	},
	[blockchains.FANTOM]: {
		[COLLECTION_IDS.LITTLEGHOST]: ftmBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: ftmBridgedEctoSkeletonTokenAddress,
	},
	[blockchains.AVALANCHE]: {
		[COLLECTION_IDS.LITTLEGHOST]: avaxBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: avaxBridgedEctoSkeletonTokenAddress,
	},
	[blockchains.POLYGON]: {
		[COLLECTION_IDS.LITTLEGHOST]: maticBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: maticBridgedEctoSkeletonTokenAddress,
	},
	[blockchains.HARMONY]: {
		[COLLECTION_IDS.LITTLEGHOST]: oneBridgedLittleGhostTokenAddress,
		[COLLECTION_IDS.ECTOSKELETON]: oneBridgedEctoSkeletonTokenAddress,
	},
};

const ACTIVE_WEB3 = {
	[blockchains.BSC]: web3Bsc,
	[blockchains.ETHEREUM]: web3Eth,
	[blockchains.CRONOS]: web3Cro,
	[blockchains.FANTOM]: web3Ftm,
	[blockchains.AVALANCHE]: web3Avax,
	[blockchains.POLYGON]: web3Matic,
	[blockchains.HARMONY]: web3One,
};

const bridgedBlockchains = [
	{
		id: blockchains.BSC,
		name: blockchainNames[blockchains.BSC],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/bsc-logo.png`,
		disabled: false,
	},
	{
		id: blockchains.ETHEREUM,
		name: blockchainNames[blockchains.ETHEREUM],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/ethereum-logo.png`,
		disabled: false,
	},
	{
		id: blockchains.CRONOS,
		name: blockchainNames[blockchains.CRONOS],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/cronos-logo.svg`,
		disabled: false,
	},
	{
		id: blockchains.FANTOM,
		name: blockchainNames[blockchains.FANTOM],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/fantom-logo.png`,
		disabled: false,
	},
	{
		id: blockchains.AVALANCHE,
		name: blockchainNames[blockchains.AVALANCHE],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/avalanche-logo.png`,
		disabled: false,
	},
	{
		id: blockchains.POLYGON,
		name: blockchainNames[blockchains.POLYGON],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/polygon-logo.svg`,
		disabled: false,
	},
	{
		id: blockchains.HARMONY,
		name: blockchainNames[blockchains.HARMONY],
		image: `${process.env.PUBLIC_URL}/assets/images/blockchains/harmony-one-logo.svg`,
		disabled: false,
	},
];

const weiToBnb = (wei) => {
	return +(+Web3.utils.fromWei(wei, 'ether')).toFixed(5);
};

const NFtBridge = () => {
	const { t, ready } = useTranslation('translation', {
		keyPrefix: 'NftBridge',
	});
	const { t: t2, ready: ready2 } = useTranslation('translation', {
		keyPrefix: 'blockchains',
	});
	const { t: t3, ready: ready3 } = useTranslation('translation', {
		keyPrefix: 'CollectionNames',
	});

	const { library, account, chainId } = useActiveWeb3React();
	const [approved, setApproved] = useState(false);
	const [tokens, setTokens] = useState([] as Array<any>);
	const [swapFee, setSwapFee] = useState(BigInt(0));
	const [swaps, setSwaps] = useState([] as Array<Swap>);
	const [isFetchingSwaps, setIsFetchingswaps] = useState(false);
	const [tokenIdsMap, setTokenIdsMap] = useState(
		{} as Record<number, boolean>
	);
	const [selectedTokenIds, setSelectedTokenIds] = useState(
		[] as Array<number>
	);
	const [selectedBlockchain, setSelectedBlockchain] = useState(
		blockchains.BSC
	);

	const [selectedDestinationBlockchain, setSelectedDestinationBlockchain] =
		useState(blockchains.ETHEREUM);

	const [collectionAddress, setCollectionAddress] = useState(
		littleGhostNFTAddress
	);

	const [collectionID, setCollectionID] = useState(
		COLLECTION_IDS.LITTLEGHOST
	);

	const [destinationAddress, setDestinationAddress] = useState('');

	const view3d = useView3d();

	const handleChange = (id) => {
		const _tokenIdsMap = {
			...tokenIdsMap,
		};
		_tokenIdsMap[id] = !_tokenIdsMap[id];
		setTokenIdsMap(_tokenIdsMap);
	};

	const checkIfBridgeContractIsApproved = async () => {
		if (!account) {
			return;
		}
		const activeWeb3 = ACTIVE_WEB3[selectedBlockchain];

		const CollectionContract = new activeWeb3.eth.Contract(
			bridgedErc721ABI as AbiItem[],
			collectionAddress
		);

		//@ts-ignore
		return CollectionContract.methods
			.isApprovedForAll(account, BRIDGE_ADDRESSES[selectedBlockchain])
			.call()
			.then((res) => {
				setApproved(res);
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const handleOnSelectedBlockchainSelect = (value: number) => {
		if (value === selectedDestinationBlockchain) {
			setSelectedDestinationBlockchain(selectedBlockchain);
		}
		setSelectedBlockchain(value);
	};

	const changeChain = async (blockchainID: number) => {
		try {
			if (!window.ethereum) throw new Error('No provider was found');
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: `0x${Number(blockchainID).toString(16)}` }],
			});
		} catch (err: any) {
			console.log(err.message);
			if (err.message.indexOf('Unrecognized chain ID') !== -1) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [supportedNetworks[blockchainID]],
					});
				} catch (error: any) {
					if (
						error.message ===
						'May not specify default MetaMask chain.'
					) {
						error.message =
							'Please mannually switch to Ethereum Chain';
					}
					cogoToast.error(error.message, toastOptions);
				}
				return;
			}
			if (err.message === 'May not specify default MetaMask chain.') {
				err.message = 'Please mannually switch to Ethereum Chain';
			}
			cogoToast.error(err.message, toastOptions);
		}
	};

	const approveContract = () => {
		if (!account) {
			return;
		}
		if (chainId != selectedBlockchain) {
			changeChain(selectedBlockchain);
			return;
		}

		const activeWeb3 = ACTIVE_WEB3[selectedBlockchain];

		const CollectionContract = new activeWeb3.eth.Contract(
			bridgedErc721ABI as AbiItem[],
			collectionAddress
		);
		const encoded = CollectionContract.methods
			.setApprovalForAll(BRIDGE_ADDRESSES[selectedBlockchain], true)
			.encodeABI();

		library
			?.getSigner()
			.sendTransaction({
				from: account,
				to: collectionAddress,
				value: 0,
				data: encoded,
			})
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Waiting to approve bridge...',
					successMessage: 'Bridge is successfully approved!',
					res,
					callback: () => {
						setApproved(true);
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	const fetchSwaps = () => {
		if (isFetchingSwaps) {
			return;
		}
		if (account) {
			setIsFetchingswaps(true);
			fetchSwapsBySender({ sender: account }).then((_swaps) => {
				setSwaps(_swaps);
				setIsFetchingswaps(false);
			});
		} else {
			setSwaps([]);
		}
	};

	const swap = () => {
		if (!account) {
			return;
		}
		if (chainId != selectedBlockchain) {
			changeChain(selectedBlockchain);
			return;
		}

		const activeWeb3 = ACTIVE_WEB3[selectedBlockchain];

		const BridgeContract = new activeWeb3.eth.Contract(
			bridgeABI as AbiItem[],
			BRIDGE_ADDRESSES[selectedBlockchain]
		);

		const encoded = BridgeContract.methods
			.swap(
				collectionAddress,
				destinationAddress,
				selectedTokenIds,
				selectedDestinationBlockchain
			)
			.encodeABI();

		library
			?.getSigner()
			.sendTransaction({
				from: account,
				to: BRIDGE_ADDRESSES[selectedBlockchain],
				value: swapFee * BigInt(selectedTokenIds.length),
				data: encoded,
			})
			.then((res) => {
				handleWeb3Reponse({
					waitingMessage: 'Transferring tokens to the bridge...',
					successMessage:
						'Tokens have been sent to the bridge. Waiting on the bridge to fullfill the request',
					res,
					callback: () => {
						if (account) {
							fetchCollectionItemsByAddress({
								blockchain: selectedBlockchain,
								collection: collectionAddress,
								address: account,
							}).then((response: any) => {
								if (response.data.ownedItems) {
									setTokens(response.data.ownedItems);
								}
							});
						}
					},
				});
			})
			.catch((err) => {
				handleWeb3Error(err);
			});
	};

	useEffect(() => {
		const _tokenIdsMap = {};
		tokens.forEach((token) => {
			_tokenIdsMap[token.id] = false;
		});
		setTokenIdsMap(_tokenIdsMap);
	}, [tokens]);

	useEffect(() => {
		if (account && selectedBlockchain && collectionAddress) {
			checkIfBridgeContractIsApproved();
			fetchCollectionItemsByAddress({
				blockchain: selectedBlockchain,
				collection: collectionAddress,
				address: account,
			}).then((response: any) => {
				if (response.data.ownedItems) {
					setTokens(response.data.ownedItems);
				}
			});
		}
	}, [account, collectionAddress]);

	useEffect(() => {
		fetchSwaps();
	}, [account]);

	useEffect(() => {
		const _selectedTokenIds = [] as Array<number>;
		Object.keys(tokenIdsMap).forEach((key) => {
			if (tokenIdsMap[key]) {
				_selectedTokenIds.push(+key);
			}
		});
		setSelectedTokenIds(_selectedTokenIds);
	}, [tokenIdsMap]);

	useEffect(() => {
		setCollectionAddress(
			COLLECTION_ADDRESSES[selectedBlockchain][collectionID]
		);
	}, [selectedBlockchain, collectionID]);

	useEffect(() => {
		const activeWeb3 = ACTIVE_WEB3[selectedBlockchain];

		const BridgeContract = new activeWeb3.eth.Contract(
			bridgeABI as AbiItem[],
			BRIDGE_ADDRESSES[selectedBlockchain]
		);

		BridgeContract.methods
			.swapFee(selectedDestinationBlockchain)
			.call()
			.then((_fee) => {
				setSwapFee(BigInt(_fee));
			});
	}, [selectedBlockchain, selectedDestinationBlockchain]);

	useEffect(() => {
		if (
			selectedBlockchain != blockchains.BSC &&
			selectedDestinationBlockchain != blockchains.BSC
		) {
			setSelectedDestinationBlockchain(blockchains.BSC);
		}
	}, [selectedBlockchain]);

	useEffect(() => {
		if (
			selectedBlockchain != blockchains.BSC &&
			selectedDestinationBlockchain != blockchains.BSC
		) {
			setSelectedBlockchain(blockchains.BSC);
		}
	}, [selectedDestinationBlockchain]);

	return (
		<>
			<div id='NftBridge' className='container'>
				<div className='header my-5 d-flex justify-content-between'>
					<div className='title_wrapper'>
						<Translation ready={ready}>
							<p id='title'>
								{t('title', {
									defaultValue: 'NFT Bridge BETA',
								})}
							</p>
						</Translation>
					</div>
				</div>
				<div className='body'>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
							<div className='card-wrapper'>
								<div className='card py-5'>
									<Grid
										container
										justifyContent='space-between'
									>
										<Grid item>
											<div>
												<div className='label mb-4 ms-2'>
													<Translation ready={ready}>
														{t(
															'selected_blockchain',
															{
																defaultValue:
																	'Selected Blockchain',
															}
														)}
														:
													</Translation>
												</div>
												<Translation ready={ready2}>
													<FormControl
														variant='outlined'
														style={{
															maxWidth: '250px',
															minWidth: '180px',
														}}
													>
														<DropdownSelect
															value={
																selectedBlockchain
															}
															onChange={(evt) => {
																handleOnSelectedBlockchainSelect(
																	+evt.target
																		.value
																);
															}}
														>
															{bridgedBlockchains.map(
																(
																	_blockchain
																) => {
																	return (
																		<DropdownSelectItem
																			value={
																				_blockchain.id
																			}
																			key={
																				_blockchain.id
																			}
																			disabled={
																				_blockchain.disabled
																			}
																		>
																			<ImageTag
																				src={
																					_blockchain.image
																				}
																				height='20px'
																				width='20px'
																			/>
																			<span className='ms-3'>
																				{t2(
																					_blockchain.name,
																					{
																						defaultValue:
																							_blockchain.name,
																					}
																				)}
																			</span>
																		</DropdownSelectItem>
																	);
																}
															)}
														</DropdownSelect>
													</FormControl>
												</Translation>
											</div>
										</Grid>
										<Grid item>
											<div>
												<div className='label mb-4'>
													<Translation ready={ready}>
														{t('nft_collection', {
															defaultValue:
																'NFT Collection',
														})}
														:
													</Translation>
												</div>
												<Translation ready={ready3}>
													<FormControl
														variant='outlined'
														style={{
															maxWidth: '180px',
														}}
													>
														<DropdownSelect
															value={collectionID}
															onChange={(evt) => {
																setCollectionID(
																	+evt.target
																		.value
																);
															}}
														>
															<DropdownSelectItem
																value={
																	COLLECTION_IDS.LITTLEGHOST
																}
															>
																<span>
																	{t3(
																		'LittleGhosts',
																		{
																			defaultValue:
																				'LittleGhosts',
																		}
																	)}
																</span>
															</DropdownSelectItem>
															<DropdownSelectItem
																value={
																	COLLECTION_IDS.ECTOSKELETON
																}
															>
																<span>
																	{t3(
																		'EctoSkeletons',
																		{
																			defaultValue:
																				'EctoSkeletons',
																		}
																	)}
																</span>
															</DropdownSelectItem>
															);
														</DropdownSelect>
													</FormControl>
												</Translation>
											</div>
										</Grid>
									</Grid>

									<div
										style={{
											maxHeight: '480px',
											overflowY: 'auto',
										}}
										className='scrollbar-3 mt-5'
									>
										<FormControl component='fieldset'>
											<FormGroup
												aria-label='position'
												row
												style={{
													justifyContent:
														'space-between',
												}}
											>
												{tokens.map((token) => {
													return (
														<FormControlLabel
															key={`${collectionAddress}-${token.id}`}
															value={token.id}
															checked={
																!!tokenIdsMap[
																	token.id
																]
															}
															control={
																<Checkbox color='primary' />
															}
															onChange={() => {
																handleChange(
																	token.id
																);
															}}
															label={
																<>
																	<img
																		src={collectionItemImageUrl(
																			{
																				item: token,
																				view3d,
																			}
																		)}
																		alt=''
																		width='100'
																		height='100'
																		style={{
																			objectFit:
																				'cover',
																			borderRadius:
																				'100%',
																		}}
																	/>
																	<div className='color-white text-center'>
																		ID:{' '}
																		{
																			token.id
																		}
																	</div>

																	{token.rank !=
																		null && (
																		<div className='color-white text-center'>
																			<Translation
																				ready={
																					ready
																				}
																			>
																				{t(
																					'rank',
																					{
																						defaultValue:
																							'Rank',
																					}
																				)}

																				:
																				{` ${token.rank}`}
																			</Translation>
																		</div>
																	)}
																</>
															}
															labelPlacement='top'
														/>
													);
												})}
											</FormGroup>
										</FormControl>
									</div>
								</div>
							</div>
						</Grid>
						<Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
							<div className='card-wrapper right'>
								<div className='card py-5'>
									<Grid
										container
										justifyContent='space-between'
									>
										<Grid
											item
											className='align-self-center'
										>
											<div className='label'>
												<Translation ready={ready}>
													{t('destination', {
														defaultValue:
															'Destination',
													})}
													:
												</Translation>
											</div>
										</Grid>
										<Grid item>
											<FormControl
												variant='outlined'
												style={{
													maxWidth: '250px',
													minWidth: '180px',
												}}
											>
												<DropdownSelect
													value={
														selectedDestinationBlockchain
													}
													onChange={(evt) => {
														setSelectedDestinationBlockchain(
															+evt.target.value
														);
													}}
												>
													{bridgedBlockchains.map(
														(_blockchain) => {
															return (
																<DropdownSelectItem
																	value={
																		_blockchain.id
																	}
																	key={
																		_blockchain.id
																	}
																	className={
																		_blockchain.id ===
																		selectedBlockchain
																			? 'hide'
																			: ''
																	}
																	disabled={
																		_blockchain.disabled
																	}
																>
																	<ImageTag
																		src={
																			_blockchain.image
																		}
																		height='20px'
																		width='20px'
																	/>
																	<span className='ms-3'>
																		{
																			_blockchain.name
																		}
																	</span>
																</DropdownSelectItem>
															);
														}
													)}
													);
												</DropdownSelect>
											</FormControl>
										</Grid>
									</Grid>
									<Grid
										container
										justifyContent='space-between'
										className='mt-4'
									>
										<Grid
											item
											className='align-self-center'
										>
											<div className='label'>
												<Translation ready={ready}>
													{t('recipient', {
														defaultValue:
															'Recipient',
													})}
													:
												</Translation>
											</div>
										</Grid>
										<Grid item>
											<TextField
												value={destinationAddress}
												required
												onChange={(event) =>
													setDestinationAddress(
														event.target.value
													)
												}
												placeholder='0x0...'
											/>
										</Grid>
									</Grid>
									<Grid
										container
										justifyContent='space-between'
										className='mt-4'
									>
										<Grid
											item
											className='align-self-center'
										>
											<div className='label'>
												<Translation ready={ready}>
													{t('selected_nfts', {
														defaultValue:
															'Selected NFTs',
													})}
													:
												</Translation>
											</div>
										</Grid>
										<Grid item>
											<div className='text'>
												<Translation ready={ready}>
													{selectedTokenIds
														.map((x) => `#${x}`)
														.join(', ') ||
														t('none_selected', {
															defaultValue:
																'None selected',
														})}
												</Translation>
											</div>
										</Grid>
									</Grid>
									{!approved && (
										<Grid
											container
											justifyContent='space-between'
											className='mt-4'
										>
											<Grid
												item
												className='align-self-center'
											>
												<div className='label'>
													{' '}
													<Translation ready={ready}>
														{t('approval', {
															defaultValue:
																'Approval',
														})}
													</Translation>
													:
												</div>
											</Grid>
											<Grid item>
												<Loading loading={!ready}>
													<OutlinedButton
														onClick={() => {
															approveContract();
														}}
													>
														{t('approve', {
															defaultValue:
																'Approve',
														})}
													</OutlinedButton>
												</Loading>
											</Grid>
										</Grid>
									)}
									<Divider className='my-5' />
									<Grid
										container
										justifyContent='space-between'
										className='mt-4'
									>
										<Grid
											item
											className='align-self-center'
										>
											<div className='label'>
												<Translation ready={ready}>
													{t('fees', {
														defaultValue: 'Fees',
													})}
													:
												</Translation>
											</div>
										</Grid>
										<Grid item>
											<div className='text'>
												{weiToBnb(
													(
														swapFee *
														BigInt(
															selectedTokenIds.length
														)
													).toString()
												)}{' '}
												{
													NATIVE_TOKEN_UNITS[
														selectedBlockchain
													]
												}
											</div>
										</Grid>
									</Grid>
								</div>
								{approved && (
									<div className='send'>
										<Loading loading={!ready}>
											<OutlinedButton
												onClick={() => {
													swap();
												}}
											>
												{t('swap', {
													defaultValue: 'Swap',
												})}
											</OutlinedButton>
										</Loading>
									</div>
								)}
							</div>
						</Grid>
					</Grid>
					<div className='transactions scrollbar-3 mt-5 py-5 px-5'>
						<div className='title text-center'>
							<Translation ready={ready}>
								{t('swap_history', {
									defaultValue: 'Swap History',
								})}{' '}
								<IconButton
									onClick={() => {
										fetchSwaps();
									}}
								>
									<RefreshIcon fontSize='large' />
								</IconButton>
							</Translation>
						</div>
						{isFetchingSwaps && <LinearProgress />}
						<table className='full-width'>
							<thead>
								<tr>
									<th>NFT</th>
									<th>Ids</th>
									<th>
										<Translation ready={ready}>
											{t('from', {
												defaultValue: 'From',
											})}
										</Translation>
									</th>
									<th>
										<Translation ready={ready}>
											{t('from_tx', {
												defaultValue: 'From Tx',
											})}
										</Translation>
									</th>
									<th>
										<Translation ready={ready}>
											{t('to', { defaultValue: 'To' })}
										</Translation>
									</th>
									<th>
										<Translation ready={ready}>
											{t('to_tx', {
												defaultValue: 'To Tx',
											})}
										</Translation>
									</th>
									<th>
										<Translation ready={ready}>
											{t('recipient', {
												defaultValue: 'Recipient',
											})}
										</Translation>
									</th>
									<th>
										<Translation ready={ready}>
											{t('status', {
												defaultValue: 'Status',
											})}
										</Translation>
									</th>
								</tr>
							</thead>
							<tbody className='pt-5'>
								{swaps.map((swap) => {
									return (
										<tr
											key={
												swap.from_chain_backward_swap_tx ||
												swap.from_chain_swap_tx
											}
										>
											<td>
												<Translation ready={ready3}>
													{t3(
														swap.from_chain_token_name,
														{
															defaultValue:
																swap.from_chain_token_name,
														}
													)}
												</Translation>
											</td>
											<td>
												{swap.token_ids
													.map((x) => `#${x}`)
													.join(', ')}
											</td>
											<td>
												<Translation ready={ready2}>
													{t2(swap.from_chain_name, {
														defaultValue:
															swap.from_chain_name,
													})}
												</Translation>
											</td>
											<td>
												<ExternalLink
													href={`${
														EXPLORER_LINKS
															.TRANSACTIONS[
															swap.from_chain
														]
													}/${
														swap.from_chain_backward_swap_tx ||
														swap.from_chain_swap_tx
													}`}
												>
													{displayUntilLength(
														swap.from_chain_backward_swap_tx ||
															swap.from_chain_swap_tx,
														5
													)}
												</ExternalLink>
											</td>
											<td>
												<Translation ready={ready2}>
													{t2(swap.to_chain_name, {
														defaultValue:
															swap.to_chain_name,
													})}
												</Translation>
											</td>
											<td>
												<ExternalLink
													href={`${
														EXPLORER_LINKS
															.TRANSACTIONS[
															swap.to_chain
														]
													}/${
														swap.to_chain_backward_fill_tx ||
														swap.to_chain_fill_tx
													}`}
												>
													{displayUntilLength(
														swap.to_chain_backward_fill_tx ||
															swap.to_chain_fill_tx ||
															'',
														5
													)}
												</ExternalLink>
											</td>
											<td>
												<ExternalLink
													href={`${
														EXPLORER_LINKS.ADDRESS[
															swap.to_chain
														]
													}/${swap.recipient}`}
												>
													{displayUntilLength(
														swap.recipient,
														5
													)}
												</ExternalLink>
											</td>
											<td>
												<Translation ready={ready}>
													{t(
														`statuses.${swap.status_name}`,
														{
															defaultValue:
																swap.status_name,
														}
													)}
												</Translation>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<QuickSetting />
		</>
	);
};

export default NFtBridge;
