import { fetchCollectionItems, fetchFilters } from '../../apis/web/web.api';
import {
	setBnbPrice as setGlobalBnbPrice,
	setCollectionDetails as setGlobalCollectionDetails,
	setFilters as setGlobalFilters,
	setForSales as setGlobalForSales,
	setPages as setGlobalPages,
	setSelectedFilters as setGlobalSelectedFilters,
	setSortBys as setGlobalSortBys,
	setVolumes as setGlobalVolumes,
} from './marketplace.slice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import { AppState } from '../../state';
import { CollectionDetail } from './types/CollectionDetail';
import Web3 from 'web3';
import { activeNode } from '../../constants/Nodes';
import { aggregatorV3InterfaceABI } from '../../constants/abis/aggregatorV3InterfaceABI';
import axios from 'axios';
import { blockchains } from '../../constants/Blockchains';
import { chainlinkAggregatorV3InterfaceAddress } from '../../constants/ContractAddresses';
import { forSales } from '../../components/Marketplace/constants/forSales';
import { isAddress } from '../../utils';
import { sortBys } from '../../components/Marketplace/constants/sortBys';

const web3 = new Web3(activeNode);

const fetchBnbPrice = async () => {
	const priceFeed = new web3.eth.Contract(
		// @ts-ignore
		aggregatorV3InterfaceABI,
		chainlinkAggregatorV3InterfaceAddress
	);
	return priceFeed.methods
		.latestAnswer()
		.call()
		.then((price) => {
			return price / 10 ** 8;
		});
};

const fetchVolume = async () => {
	return axios
		.get(`${process.env.REACT_APP_API}/stats/volume`)
		.then((res) => {
			return res.data as string;
		});
};

const fetchVolumeFromPolarSync = async (_address: string): Promise<string> => {
	const _fetch = axios.post(
		'https://api.polarsync.app/subgraphs/id/QmXBWyu9Bhu9dmkEzMeFRNsNaDqanuf9wrcNvvRghkWJHw',
		{
			query: `
					{
						collections(where:{id: "${_address}"}) {
						    totalVolumeBNB
						}
					}`,
		}
	) as Promise<{
		data: { data: { collections: Array<{ totalVolumeBNB: string }> } };
	}>;

	return _fetch.then((res) => {
		return (+res.data.data.collections[0].totalVolumeBNB).toFixed(2);
	});
};

const fetchCollectionDetails = async (_address) => {
	const _fetch = axios.get(
		`${process.env.REACT_APP_API}/nftmarketplace/collections/${_address}`
	) as Promise<{
		data: CollectionDetail;
	}>;

	return _fetch;
};

const getSearchParams = (page, forSale, sortBy, selectedFilters) => {
	const params = {
		limit: itemsPerPage,
		offset: (page - 1) * itemsPerPage,
	} as any;
	if (forSale) {
		if (+forSale === 3) {
			params.recently_sold = 1;
		} else {
			params.for_sale = forSale;
		}
	}
	if (sortBy) {
		params.sort_by = sortBy;
	}
	const fils = JSON.parse(JSON.stringify(selectedFilters));
	Object.keys(fils).forEach((key) => {
		if (fils[key].length === 1 && fils[key][0] === 'All') {
			delete fils[key];
		} else {
			fils[key] = fils[key].map((item) => {
				return item;
			});
			if (!fils[key].length) {
				delete fils[key];
			}
		}
	});
	params.filters = fils;

	return params;
};

export const marketplaces = {
	ALL: 'all',
	LG: 'littleGhosts',
	PCS: 'pancakeswap',
};

const itemsPerPage = 24;

export const useMarketplace = () => {
	const dispatch = useDispatch();

	/* Marketplace States */
	const [marketplace, setMarketplace] = useState('');
	const [collectionAddress, setCollectionAddress] = useState('');
	const [volume, setVolume] = useState(0 as number | string);
	const [collectionDetail, setCollectionDetail] = useState(
		{} as CollectionDetail
	);
	const [filters, setFilters] = useState({} as Record<string, Array<string>>);
	const [selectedFilters, setSelectedFilters] = useState(
		{} as Record<string, Array<string>>
	);
	const [forSale, setForSale] = useState(forSales.FOR_SALE.toString());
	const [sortBy, setSortBy] = useState(sortBys.LOWEST_PRICE.toString());
	const [page, setPage] = useState(1);

	const [isFetching, setIsFetching] = useState(true);
	// Values set after fetch
	const [items, setItems] = useState([] as Array<any>);
	const [itemsCount, setItemsCount] = useState(0);
	const [pageCount, setPageCount] = useState(0);

	/* Global States*/
	const bnbPrice = useSelector(
		(state: AppState) => state.marketplace.bnbPrice
	);
	const volumes = useSelector((state: AppState) => state.marketplace.volumes);
	const collectionDetails = useSelector(
		(state: AppState) => state.marketplace.collectionDetails
	);
	const globalFilters = useSelector(
		(state: AppState) => state.marketplace.filters
	);
	const globalSelectedFilters = useSelector(
		(state: AppState) => state.marketplace.selectedFilters
	);
	const globalForSales = useSelector(
		(state: AppState) => state.marketplace.forSales
	);
	const globalSortBys = useSelector(
		(state: AppState) => state.marketplace.sortBys
	);
	const globalPages = useSelector(
		(state: AppState) => state.marketplace.pages
	);

	const getItems = async (
		_page,
		_forSale,
		_sortBy,
		_selectedFilters,
		marketplace,
		collectionAddress
	) => {
		setIsFetching(true);
		fetchCollectionItems({
			blockchain: blockchains.BSC,
			params: getSearchParams(_page, _forSale, _sortBy, _selectedFilters),
			marketplace,
			collection: collectionAddress,
		})
			.then((response: any) => {
				setItems(response.data);
				setItemsCount(response.total_rows);
				setPageCount(response.pages);
				setIsFetching(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		// bnb price
		if (!bnbPrice) {
			fetchBnbPrice().then((price) => {
				dispatch(setGlobalBnbPrice(price));
			});
		}
	}, []);

	useEffect(() => {
		let _page = page,
			_forSale = forSale,
			_sortBy = sortBy,
			_selectedFilters = {};
		if (!isAddress(collectionAddress) && !marketplace) {
			return;
		}
		if (!volumes[collectionAddress]) {
			fetchVolume().then((res) => {
				setVolume(res);
				dispatch(
					setGlobalVolumes({
						[collectionAddress]: res,
					})
				);
			});
		} else {
			setVolume(volumes[collectionAddress]);
		}

		if (!collectionDetails[collectionAddress]) {
			fetchCollectionDetails(collectionAddress).then((res) => {
				setCollectionDetail(res.data);
				dispatch(
					setGlobalCollectionDetails({
						[collectionAddress]: res.data,
					})
				);
			});
		} else {
			setCollectionDetail(collectionDetails[collectionAddress]);
		}

		if (!globalFilters[collectionAddress]) {
			fetchFilters({
				blockchain: blockchains.BSC,
				address: collectionAddress,
			}).then((res) => {
				const _filters = res.data as Record<string, Array<string>>;
				Object.keys(_filters).forEach((key) => {
					_filters[key] = _filters[key].filter((fil) => {
						return fil !== null;
					});
					_filters[key].unshift('All');
					_selectedFilters[key] = ['All'];
				});
				setFilters(_filters);
				setSelectedFilters(_selectedFilters);
				dispatch(setGlobalFilters({ [collectionAddress]: _filters }));
			});
		} else {
			const _filters = globalFilters[collectionAddress];
			setFilters(globalFilters[collectionAddress]);

			if (!globalSelectedFilters[collectionAddress]) {
				Object.keys(_filters).forEach((key) => {
					_selectedFilters[key] = ['All'];
				});
				setSelectedFilters(_selectedFilters);
				dispatch(
					setGlobalSelectedFilters({
						[collectionAddress]: _selectedFilters,
					})
				);
			} else {
				_selectedFilters = globalSelectedFilters[collectionAddress];
				setSelectedFilters(globalSelectedFilters[collectionAddress]);
			}
		}

		if (globalForSales[collectionAddress]) {
			_forSale = globalForSales[collectionAddress];
			setForSale(globalForSales[collectionAddress]);
		}

		if (globalSortBys[collectionAddress]) {
			_sortBy = globalSortBys[collectionAddress];
			setSortBy(globalSortBys[collectionAddress]);
		}

		if (globalPages[collectionAddress]) {
			_page = globalPages[collectionAddress];
			setPage(globalPages[collectionAddress]);
		}
		getItems(
			_page,
			_forSale,
			_sortBy,
			_selectedFilters,
			marketplace,
			collectionAddress
		);
	}, [collectionAddress, marketplace]);

	useEffect(() => {
		if (collectionAddress) {
			dispatch(
				setGlobalSelectedFilters({
					[collectionAddress]: selectedFilters,
				})
			);
		}
	}, [selectedFilters]);

	useEffect(() => {
		if (collectionAddress) {
			dispatch(
				setGlobalForSales({
					[collectionAddress]: forSale,
				})
			);
		}
	}, [forSale]);

	useEffect(() => {
		if (collectionAddress) {
			dispatch(
				setGlobalSortBys({
					[collectionAddress]: sortBy,
				})
			);
		}
	}, [sortBy]);

	const init = useRef(false);
	useEffect(() => {
		if (!init.current) {
			init.current = true;
			return;
		}
		if (collectionAddress) {
			dispatch(
				setGlobalPages({
					[collectionAddress]: page,
				})
			);
			getItems(
				page,
				forSale,
				sortBy,
				selectedFilters,
				marketplace,
				collectionAddress
			);
		}
	}, [page]);

	const init1 = useRef(0);
	const forsaleRef = useRef(forSale);
	useEffect(() => {
		if (init1.current < 2) {
			init1.current++;
			return;
		}
		if (collectionAddress) {
			if (+forSale === forSales.RECENTLY_SOLD) {
				if (+sortBy !== sortBys.LATEST) {
					setSortBy(sortBys.LATEST.toString());
					return;
				}
			}
			if (
				+forSale === forSales.AUCTION &&
				+forsaleRef.current !== forSales.AUCTION
			) {
				forsaleRef.current = forSale;
				setSortBy(sortBys.LOWEST_BID.toString());
				return;
			}
			if (
				+forsaleRef.current === forSales.AUCTION &&
				+forSale !== forSales.AUCTION
			) {
				forsaleRef.current = forSale;
				setSortBy(sortBys.LOWEST_PRICE.toString());
				return;
			}
			forsaleRef.current = forSale;
			if (page === 1) {
				getItems(
					page,
					forSale,
					sortBy,
					selectedFilters,
					marketplace,
					collectionAddress
				);
				return;
			}
			setPage(1);
		}
	}, [selectedFilters, sortBy, forSale]);

	return {
		volume,
		filters,
		selectedFilters,
		collectionDetail,
		collectionAddress,
		setMarketplace,
		bnbPrice,
		setCollectionAddress,
		setSelectedFilters,
		setPage,
		itemsCount,
		forSale,
		setForSale,
		sortBy,
		setSortBy,
		isFetching,
		items,
		pageCount,
		page,
	};
};
