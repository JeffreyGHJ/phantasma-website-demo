import './index.scss';

import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	useMediaQuery,
} from '@mui/material';
import {
	useCollections,
	useUpdateCollectionTokens,
	useUpdateCollections,
} from '../../../../state/community/hook';
import { useEffect, useMemo, useState } from 'react';

import { AbiItem } from 'web3-utils';
import AssetCard from '../../../widgets/Card/AssetCardGroup/AssetCard';
import AssetCardGroup from '../../../widgets/Card/AssetCardGroup';
import AttributeAccordion from '../../../widgets/Accordion/AttributeAccordion';
import AttributeAccordionDetails from '../../../widgets/Accordion/AttributeAccordion/AttributeAccordionDetails';
import AttributeAccordionSummary from '../../../widgets/Accordion/AttributeAccordion/AttributeAccordionSummary';
import Block from '../../../widgets/Sidebar/FilterSidebar/styled/Block';
import BlockContent from '../../../widgets/Sidebar/FilterSidebar/styled/BlockContent';
import CommunityCollection from '../../../../state/community/types/CommunityCollection';
import CommunityCollectionToken from '../../../../state/community/types/CommunityCollectionToken';
import FilterButton from '../../Shared/FilterButton';
import { ImageTag } from '../../../../utils/ImageUtil';
import LayoutButtonGroup from '../../Shared/LayoutButtonGroup';
import NftCard from '../../../widgets/Card/NftCard';
import NftDetailCard from '../../../widgets/Card/NftDetailCard';
import RightDrawerSidebar from '../../../widgets/Sidebar/RightDrawerSidebar';
import SidebarOverlay from '../../../widgets/Overlay/SidebarOverlay';
import Web3 from 'web3';
import { activeNode } from '../../../../constants/Nodes';
import { communityWalletAddress } from '../../../../constants/ContractAddresses';
import { fetchCommunityCollections } from '../../../../apis/web/web.api';
import { formatAttributes } from '../../../../utils/metadataUtil';
import { getHumanReadableLargeNumber } from '../../../../utils/NumberUtil';
import { getMetaData } from './api';
import { useAccountBnbBalanceDisplay } from '../../../../hooks/useAccountBalanceDisplay';
import { useBalance } from '../../../../hooks/bsc/useBalance';
import { useBusdBalance } from '../../../../hooks/bsc/useBusdBalance';
import { useEctoBalance } from '../../../../hooks/bsc/useEctoBalance';
import useMobileLayout from '../../../../hooks/useMobileLayout';
import usePageTitle from '../../../../hooks/usePageTitle';
import { useWbnbBalance } from '../../../../hooks/bsc/useWbnbBalance';
import { viewTypes } from '../../constants/viewTypes';

const web3 = new Web3(activeNode);

const Overview = () => {
	usePageTitle('Onboarding | Phantasma');

	const mobileLayout = useMobileLayout();
	const smallDevice = useMediaQuery('(max-width:430px)');

	// #region Global collections
	const collections = useCollections();
	const setCollections = useUpdateCollections();
	const setCollectionTokens = useUpdateCollectionTokens();
	// #endregion

	// #region community wallet balances
	const bnbBalance = useAccountBnbBalanceDisplay({
		balance: useBalance(communityWalletAddress),
		decimal: 3,
	});
	const ectoBalance = useEctoBalance(communityWalletAddress);
	const busdBalance = useBusdBalance(communityWalletAddress);
	const wbnbBalance = useWbnbBalance(communityWalletAddress);
	const readableEctoBalance = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +ectoBalance,
			precision: 2,
		});
	}, [ectoBalance]);
	const readableBusdRewards = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +busdBalance,
			precision: 2,
		});
	}, [busdBalance]);
	const readableWbnbRewards = useMemo(() => {
		return getHumanReadableLargeNumber({
			number: +wbnbBalance,
			precision: 2,
		});
	}, [wbnbBalance]);
	// #endregion

	// #region Project Radio Group
	const [selectedCollectionAddress, setSelectedCollectionAddress] = useState<
		null | string
	>();
	const [selectedCollection, setSelectedCollection] =
		useState<null | CommunityCollection>();

	const handleSelectedCollectionAddressChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setSelectedCollectionAddress((event.target as HTMLInputElement).value);
	};
	// #endregion

	const [showFilterSidebar, setShowFilterSidebar] = useState(false);
	const handleViewTypeChange = (viewType: string) => {
		setViewType(viewType);
	};
	const [viewType, setViewType] = useState(viewTypes.GRID_VIEW);

	useEffect(() => {
		if (!collections.length) {
			fetchCommunityCollections().then((data) => {
				setCollections(data);
			});
		}
	}, [collections, setCollections]);

	useEffect(() => {
		if (collections.length && !selectedCollectionAddress) {
			setSelectedCollectionAddress(collections[0].address);
			setSelectedCollection(collections[0]);
		}
		if (collections.length && selectedCollectionAddress) {
			const collection = collections.find((_collection) => {
				return _collection.address === selectedCollectionAddress;
			});
			if (collection) {
				setSelectedCollection(collection);
			}
		}
	}, [collections, selectedCollectionAddress]);

	useEffect(() => {
		if (!selectedCollectionAddress) {
			return () => {};
		}
		const collectionIndex = collections.findIndex((_collection) => {
			return _collection.address === selectedCollectionAddress;
		});

		if (collectionIndex === -1) {
			return () => {};
		}

		const collection = collections[collectionIndex];
		if (!collection.tokens) {
			const tokens = [] as Array<CommunityCollectionToken>;
			const promises = [] as Array<Promise<any>>;
			if (collection.token_ids) {
				const tokenIds = collection.token_ids.split(',').map((x) => +x);
				tokenIds.forEach((id) => {
					promises.push(
						getMetaData({
							url: `${collection.metadata_path}/${id}${collection.metadata_extension}`,
							serverFetching:
								collection.metadata_server_side_fetching,
						}).then((metadata) => {
							tokens.push({
								id,
								image: metadata.image,
								trait_type_value: formatAttributes(
									metadata.attributes
								),
							});
						})
					);
				});

				Promise.all(promises).then(() => {
					setCollectionTokens({
						index: collectionIndex,
						tokens,
					});
				});
			} else if (
				collection.tokens_of_owner_supported &&
				collection.method
			) {
				const abi = [
					{
						inputs: [
							{
								internalType: 'address',
								name: '_owner',
								type: 'address',
							},
						],
						name: collection.method,
						outputs: [
							{
								internalType: 'uint256[]',
								name: '',
								type: 'uint256[]',
							},
						],
						stateMutability: 'view',
						type: 'function',
					},
				];

				const Contract = new web3.eth.Contract(
					abi as AbiItem[],
					collection.address
				);

				Contract.methods[collection.method](communityWalletAddress)
					.call()
					.then((tokenIds) => {
						const promises = [] as Array<Promise<any>>;
						tokenIds.forEach((id) => {
							promises.push(
								getMetaData({
									url: `${collection.metadata_path}/${id}${collection.metadata_extension}`,
									serverFetching:
										collection.metadata_server_side_fetching,
								}).then((metadata) => {
									tokens.push({
										id: +id,
										image: metadata.image,
										trait_type_value: formatAttributes(
											metadata.attributes
										),
									});
								})
							);
						});
						Promise.all(promises).then(() => {
							setCollectionTokens({
								index: collectionIndex,
								tokens,
							});
						});
					});
			}
		}
		return () => {};
	}, [selectedCollectionAddress, collections, setCollectionTokens]);

	return (
		<div id='VaultOverview'>
			{!mobileLayout && (
				<div id='Sidebar' className='scrollbar'>
					<SidebarContent
						selectedCollectionAddress={
							selectedCollectionAddress || ''
						}
						handleSelectedCollectionAddressChange={
							handleSelectedCollectionAddressChange
						}
						collections={collections}
					/>
				</div>
			)}
			<div
				id='Content'
				className={`scrollbar ${mobileLayout ? 'full' : ''}`}
			>
				<AssetCardGroup className='AssetCardGroup'>
					<AssetCard
						Logo={
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/binance_32.webp`}
								width='30px'
								height='auto'
								alt='wbnb'
							/>
						}
						amount={bnbBalance}
						asset='BNB'
					/>
					<AssetCard
						Logo={
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/Ecto.png`}
								width='35px'
								height='auto'
								alt='ecto'
							/>
						}
						amount={`${readableEctoBalance.number}${readableEctoBalance.unit}`}
						asset='ECTO'
					/>
					<AssetCard
						Logo={
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/busd_32.webp`}
								width='30px'
								height='auto'
								alt='busd'
							/>
						}
						amount={`${readableBusdRewards.number}${readableBusdRewards.unit}`}
						asset='BUSD'
					/>
					<AssetCard
						Logo={
							<ImageTag
								src={`${process.env.PUBLIC_URL}/assets/images/icons/token_icons/binance_32.webp`}
								width='30px'
								height='auto'
								alt='wbnb'
							/>
						}
						amount={`${readableWbnbRewards.number}${readableWbnbRewards.unit}`}
						asset='WBNB'
					/>
				</AssetCardGroup>
				<section
					className={`filter-section ${
						smallDevice ? 'small-device' : 'large-device'
					}`}
				>
					{!smallDevice && (
						<>
							<div className='left'>
								{selectedCollection && (
									<Title collection={selectedCollection} />
								)}
							</div>
							<div className='right'>
								<div className='filter-btn-layout-wrapper'>
									{mobileLayout && (
										<div className='filter-btn'>
											<FilterButton
												setShowFilterSidebar={
													setShowFilterSidebar
												}
											/>
										</div>
									)}
									<LayoutButtonGroup
										handleViewTypeChange={
											handleViewTypeChange
										}
										viewType={viewType}
									/>
								</div>
							</div>
						</>
					)}
					{smallDevice && (
						<>
							<div className='etc-row'>
								{selectedCollection && (
									<Title collection={selectedCollection} />
								)}

								<LayoutButtonGroup
									handleViewTypeChange={handleViewTypeChange}
									viewType={viewType}
								/>
							</div>
							<div className='etc-row'>
								<div className='filter-btn'>
									<FilterButton
										setShowFilterSidebar={
											setShowFilterSidebar
										}
									/>
								</div>
							</div>
						</>
					)}
				</section>
				<section className='nft-section'>
					<div className={`nfts ${viewType}`}>
						{selectedCollection &&
							selectedCollection.tokens?.map((item) => {
								return viewType === viewTypes.GRID_VIEW ? (
									<NftCard
										key={`${selectedCollection.address}-${item.id}`}
										pathPrefix=''
										item={{
											token_id: item.id,
											name: selectedCollection.name,
											image_png: item.image,
											token_image_ext: 'png',
										}}
										showAuctionDetail={false}
									/>
								) : (
									<NftDetailCard
										key={`${selectedCollection.address}-${item.id}`}
										pathPrefix=''
										item={{
											token_id: item.id,
											name: selectedCollection.name,
											image_png: item.image,
											token_image_ext: 'png',
											trait_type_value:
												item.trait_type_value,
										}}
									/>
								);
							})}
					</div>
				</section>
				<RightDrawerSidebar
					className={`${showFilterSidebar ? 'show' : 'clear'}`}
				>
					<SidebarContent
						selectedCollectionAddress={
							selectedCollectionAddress || ''
						}
						handleSelectedCollectionAddressChange={
							handleSelectedCollectionAddressChange
						}
						collections={collections}
					/>
				</RightDrawerSidebar>
				{showFilterSidebar && (
					<SidebarOverlay
						onClick={() => {
							setShowFilterSidebar(false);
						}}
					/>
				)}
				{/* <Loader show={isFetching} /> */}
			</div>
		</div>
	);
};

const Title = ({ collection }: { collection: CommunityCollection }) => {
	return (
		<div className='title'>
			{collection.tokens?.length || 0} {collection.name}
		</div>
	);
};

const SidebarContent = ({
	selectedCollectionAddress,
	handleSelectedCollectionAddressChange,
	collections,
}: {
	selectedCollectionAddress: string;
	handleSelectedCollectionAddressChange: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	collections: CommunityCollection[];
}) => {
	return (
		<Block>
			<BlockContent className='block-content'>
				<AttributeAccordion expanded={true}>
					<AttributeAccordionSummary>
						<div className='label'>Digital Art</div>
					</AttributeAccordionSummary>
					<AttributeAccordionDetails>
						<div className='ms-3 me-3'>
							{selectedCollectionAddress && (
								<FormControl>
									<RadioGroup
										value={selectedCollectionAddress}
										onChange={
											handleSelectedCollectionAddressChange
										}
									>
										{collections.map((collection) => {
											return (
												<FormControlLabel
													key={collection.address}
													value={collection.address}
													control={<Radio />}
													label={
														<div className='label'>
															<div>
																<ImageTag
																	src={
																		collection.logo
																	}
																	height='25px'
																	width='25px'
																	alt={
																		collection.name
																	}
																/>
															</div>
															<div>
																{
																	collection.name
																}
															</div>
														</div>
													}
												/>
											);
										})}
									</RadioGroup>
								</FormControl>
							)}
						</div>
					</AttributeAccordionDetails>
				</AttributeAccordion>
			</BlockContent>
		</Block>
	);
};

export default Overview;
