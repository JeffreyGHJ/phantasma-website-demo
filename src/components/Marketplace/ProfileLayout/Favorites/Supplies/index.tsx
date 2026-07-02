import "./index.scss";

import {
    _didFilterChange,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getPageFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
    getSupplyTypeFromURL,
    getViewTypeFromURL,
} from "../../../../../utils/filterUtil";
import { allSaleTypes, saleTypes } from "../../../constants/saleTypes";
import {
    allSortTypes,
    saleSortTypes,
    sharedSortTypes,
    sortTypes,
} from "../../../constants/sortTypes";
import {
    allSupplyTypes,
    supplyCollectionAddressByType,
    supplyCollectionNameByType,
    supplyCollectionPathByType,
    supplyTypes,
} from "../../../constants/SupplyTypes";
import { allViewTypes, viewTypes } from "../../../constants/viewTypes";
import {
    founderitemsGemFilters,
    founderitemsPotionFilters,
    founderitemsRareDropFilters,
    founderitemsUltraRareDropFilters,
} from "../../../constants/foundersItemsFilters";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useUser,
} from "../../../../../state/application/hooks";

import CollectionItem from "../../../../../state/application/types/CollectionItem";
import FilterButton from "../../../Shared/FilterButton";
import JumpablePagination from "../../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../../Shared/LayoutButtonGroup";
import Loader from "../../../../widgets/Loader";
import Loading from "../../../../widgets/Loading";
import Lootbox from "../../../../../models/util_models/LootboxUtilModel/types/Lootbox";
import LootboxABI from "../../../../../constants/abis/bsc/LootboxABI";
import LootboxUtilModel from "../../../../../models/util_models/LootboxUtilModel";
import MarketplaceType from "../../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType";
import MarketplaceUtilModel from "../../../../../models/util_models/MarketplaceUtilModel";
import { Multicall } from "ethereum-multicall";
import NftCard from "../../../../widgets/Card/NftCard";
import NftDetailCard from "../../../../widgets/Card/NftDetailCard";
import RightDrawerSidebar from "../../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../../Shared/SortTypeDropdown";
import SuppliesFilterSidebarContent from "../../../../widgets/Sidebar/FilterSidebar/SuppliesFilterSidebarContent";
import Web3 from "web3";
import { activeNode } from "../../../../../constants/Nodes";
import { blockchains } from "../../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { fetchCollectionItems } from "../../../../../apis/web/web.api";
import { lootboxContractAddress } from "../../../../../constants/ContractAddresses";
import lootboxFilters from "../../../constants/lootboxFilters";
import { softEqual } from "../../../../../utils/ArrayUtil";
import supplyFilters from "../../../constants/supplyFilters";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const params = new URLSearchParams(window.location.search);
const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: false });
const allMarketplaces = MarketplaceUtilModel.ALL_MARKETPLACE_TYPES;
const marketplaceTypes = MarketplaceUtilModel.MARKETPLACE_TYPES;

function getQueryStringFromStates({
    saleType,
    sortType,
    page,
    viewType,
    marketplaces,
    filters,
    supplyType,
    supplyFiltersToUse,
}: {
    saleType: string;
    sortType: string;
    page: number;
    viewType: string;
    marketplaces: Array<string>;
    filters: Record<string, Array<string>>;
    supplyType: string;
    supplyFiltersToUse: Record<string, Array<string>>;
}) {
    const baseURI = "/marketplace/profile/favorites/supplies";
    const queryStrings = [] as Array<string>;
    const isAuction = saleType === saleTypes.AUCTION;

    if (page >= 1) {
        queryStrings.push(`page=${page}`);
    }
    if (saleType !== saleTypes.ALL && allSaleTypes.includes(saleType)) {
        queryStrings.push(`saleType=${saleType}`);
    }
    if (allSortTypes.includes(sortType)) {
        queryStrings.push(`sortType=${sortType}`);
    }
    if (allViewTypes.includes(viewType)) {
        queryStrings.push(`viewType=${viewType}`);
    }
    if (allSupplyTypes.includes(supplyType)) {
        queryStrings.push(`supplyType=${supplyType}`);
    }

    // Marketplace
    if (isAuction) {
        marketplaces = [marketplaceTypes.LG_MARKETPLACE];
    }
    if (marketplaces.length) {
        const validMarketplaces: Array<string> = [];
        marketplaces.forEach((marketplace) => {
            if (allMarketplaces.includes(marketplace as MarketplaceType)) {
                validMarketplaces.push(marketplace);
            }
        });
        if (validMarketplaces.length) {
            queryStrings.push(`marketplaces=${validMarketplaces.join(",")}`);
        } else if (isAuction) {
            queryStrings.push(
                `marketplaces=${marketplaceTypes.LG_MARKETPLACE}`
            );
        } else {
            queryStrings.push(`marketplaces=${allMarketplaces.join(",")}`);
        }
    } else {
        queryStrings.push(`marketplaces=${allMarketplaces.join(",")}`);
    }

    // Attributes/filters
    Object.keys(filters).forEach((attributeKey) => {
        if (
            attributeKey in supplyFiltersToUse &&
            filters[attributeKey].length
        ) {
            const allowedValues = filters[attributeKey]
                .filter((x) => {
                    return supplyFiltersToUse[attributeKey].includes(x);
                })
                .map((y) => {
                    return encodeURIComponent(y);
                });
            queryStrings.push(`${attributeKey}=${allowedValues.join(",")}`);
        }
    });

    const queryString = queryStrings.join("&");

    if (queryString) {
        return `${baseURI}?${queryString}`;
    }

    return baseURI;
}

const FavoriteSupplies = () => {
    const suppliesPerPage = useNftsPerPage();
    const user = useUser();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.ALL)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.HIGHEST_RANK)
    );
    const [viewType, setViewType] = useState(getViewTypeFromURL(params));
    const [supplyType, setSupplyType] = useState(getSupplyTypeFromURL(params));
    const [marketplaces, setMarketplaces] = useState(
        getMarketplacesFromURL(params)
    );
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [page, setPage] = useState(getPageFromURL(params));
    const [filters, setFilters] = useState(
        getAttributesFromURL(supplyFilters, params)
    );
    const [supplyFiltersToUse, setSupplyFiltersToUse] = useState<{}>(
        supplyFilters
    );
    const [supplies, setSupplies] = useState(
        [] as Array<CollectionItem> | Array<Lootbox>
    );
    const [suppliesTemp, setSuppliesTemp] = useState(
        [] as Array<CollectionItem> | Array<Lootbox>
    );
    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:470px)");

    const isAuction = useMemo(() => {
        return saleType === saleTypes.AUCTION;
    }, [saleType]);

    const handleSaleTypeOnChange = useCallback(
        (evt: any) => {
            let _sortType = sortType;
            const _saleType = evt.target.value;
            if (
                (_saleType === saleTypes.ALL ||
                    _saleType === saleTypes.NOT_FOR_SALE) &&
                !sharedSortTypes.includes(sortType)
            ) {
                _sortType = sortTypes.HIGHEST_RANK;
            } else if (
                _saleType === saleTypes.AUCTION &&
                !sharedSortTypes.includes(sortType)
            ) {
                _sortType = sortTypes.LOWEST_BID;
            } else if (!sharedSortTypes.includes(sortType)) {
                _sortType = sortTypes.LOWEST_PRICE;
            }
            const queryString = getQueryStringFromStates({
                saleType: _saleType,
                sortType: _sortType,
                page: 1,
                viewType,
                marketplaces,
                filters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            sortType,
            viewType,
            marketplaces,
            filters,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handleSortTypeOnChange = useCallback(
        (evt: any) => {
            const _sortType = evt.target.value;
            const queryString = getQueryStringFromStates({
                saleType,
                sortType: _sortType,
                page: 1,
                viewType,
                marketplaces,
                filters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            viewType,
            marketplaces,
            filters,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handlePageChange = useCallback(
        (_page: number) => {
            if (_page < 1 || _page > pageCount) {
                return;
            }
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: _page,
                viewType,
                marketplaces,
                filters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            viewType,
            saleType,
            sortType,
            marketplaces,
            filters,
            pageCount,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handleViewTypeChange = useCallback(
        (_viewType: string) => {
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType: _viewType,
                marketplaces,
                filters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );
    const handleSupplyTypeChange = useCallback(
        (_supplyType: string) => {
            if (_supplyType === supplyType) {
                return;
            }
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType,
                marketplaces,
                filters,
                supplyType: _supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            supplyType,
            saleType,
            sortType,
            marketplaces,
            viewType,
            filters,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handleMarketplaceChange = useCallback(
        (_marketplace: string) => {
            let newMarketplaces = [...marketplaces];
            if (marketplaces.includes(_marketplace)) {
                newMarketplaces = marketplaces.filter((x) => {
                    return x !== _marketplace;
                });
            } else {
                newMarketplaces.push(_marketplace);
            }
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType,
                marketplaces: newMarketplaces,
                filters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            viewType,
            filters,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handleFiltersChange = useCallback(
        (attribute: string, selectedValues: Array<string>) => {
            const newFilters = cloneDeep(filters);
            if (attribute in filters && attribute in supplyFiltersToUse) {
                const allowedValues = selectedValues.filter((value) => {
                    return supplyFiltersToUse[attribute].includes(value);
                });

                newFilters[attribute] = allowedValues;
            }

            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType,
                marketplaces,
                filters: newFilters,
                supplyType,
                supplyFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            viewType,
            supplyType,
            navigate,
            supplyFiltersToUse,
        ]
    );

    const handleClearFilter = useCallback(() => {
        const attributeKeys = Object.keys(supplyFiltersToUse);
        const filterAttributes = attributeKeys.reduce((curr, next) => {
            curr[next] = [];
            return curr;
        }, {});

        const queryString = getQueryStringFromStates({
            saleType,
            sortType,
            page: 1,
            viewType,
            marketplaces,
            filters: filterAttributes,
            supplyType,
            supplyFiltersToUse,
        });
        navigate(queryString);
    }, [
        saleType,
        sortType,
        viewType,
        marketplaces,
        supplyType,
        navigate,
        supplyFiltersToUse,
    ]);

    useEffect(() => {
        if (showFilterSidebar) {
            overrideStickiness();
        } else {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

    useEffect(() => {
        if (!user) {
            setSuppliesTemp([]);
            setPage(1);
            setItemsCount(0);
            setPageCount(0);
            return () => {};
        }
        const params = {
            limit: suppliesPerPage,
            offset: (page - 1) * suppliesPerPage,
            saleType,
            sortType,
            favorite: true,
            filters,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        fetchCollectionItems({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: supplyCollectionAddressByType[supplyType],
        })
            .then((response: any) => {
                if (mounted) {
                    setSuppliesTemp(response.data);
                    setItemsCount(response.total_rows);
                    setPageCount(response.pages);
                    setIsFetching(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        return () => {
            mounted = false;
        };
    }, [
        supplyType,
        saleType,
        sortType,
        page,
        marketplaces,
        filters,
        user,
        suppliesPerPage,
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const _params = new URLSearchParams(window.location.search);
        const _saleType = getSaleTypeFromURL(_params, saleTypes.ALL);
        const _sortType = getSortTypeFromURL(
            _params,
            saleSortTypes.HIGHEST_RANK
        );
        const _page = getPageFromURL(_params);
        const _viewType = getViewTypeFromURL(_params);
        const _marketplaces = getMarketplacesFromURL(_params);
        const _filters = getAttributesFromURL(supplyFiltersToUse, _params);
        const _supplyType = getSupplyTypeFromURL(_params);

        if (_saleType !== saleType) {
            setSaleType(_saleType);
        }

        if (_sortType !== sortType) {
            setSortType(_sortType);
        }

        if (_page !== page) {
            setPage(_page);
        }

        if (_viewType !== viewType) {
            setViewType(_viewType);
        }
        if (!softEqual(_marketplaces, marketplaces)) {
            setMarketplaces(_marketplaces);
        }

        if (_didFilterChange(_filters, filters)) {
            setFilters(_filters);
        }

        if (_supplyType !== supplyType) {
            setSupplyType(_supplyType);
        }
    });

    useEffect(() => {
        if (!suppliesTemp.length) {
            setSupplies([]);
            return () => {};
        }
        let mounted = true;
        if (supplyType === supplyTypes.FOUNDERS_LOOTBOXES) {
            setIsFetching(true);
            const _temp = cloneDeep(suppliesTemp) as Array<Lootbox>;
            const lootboxContractCallContext = [
                {
                    reference: "lootboxContract",
                    contractAddress: lootboxContractAddress,
                    abi: LootboxABI,
                    calls: suppliesTemp.map((supply) => {
                        return {
                            reference: "getLootboxCall",
                            methodName: "getLootbox",
                            methodParameters: [supply.token_id],
                        };
                    }),
                },
            ];

            multicall.call(lootboxContractCallContext).then((response) => {
                if (response.results.lootboxContract) {
                    response.results.lootboxContract.callsReturnContext.forEach(
                        (ctx, index) => {
                            _temp[index].requestID =
                                web3.utils.hexToNumberString(
                                    ctx.returnValues[1].hex
                                );
                            _temp[index].randomWords = ctx.returnValues[2].map(
                                (x) => {
                                    return web3.utils.hexToNumber(x.hex);
                                }
                            );
                            _temp[index].claimed = ctx.returnValues[3];

                            LootboxUtilModel.loadLootboxMetadata(_temp[index]);
                        }
                    );
                    if (mounted) {
                        setSupplies(_temp);
                        setIsFetching(false);
                    }
                }
            });

            return () => {
                mounted = false;
            };
        }

        setSupplies(cloneDeep(suppliesTemp));
        return () => {
            mounted = false;
        };
    }, [supplyType, suppliesTemp]);

    useEffect(() => {
        if (supplyType === supplyTypes.FOUNDERS_LOOTBOXES) {
            setSupplyFiltersToUse(lootboxFilters);
        } else if (supplyType === supplyTypes.GEMS) {
            setSupplyFiltersToUse(founderitemsGemFilters);
        } else if (supplyType === supplyTypes.POTIONS) {
            setSupplyFiltersToUse(founderitemsPotionFilters);
        } else if (supplyType === supplyTypes.RARE_DROPS) {
            setSupplyFiltersToUse(founderitemsRareDropFilters);
        } else if (supplyType === supplyTypes.ULTRA_RARE_DROPS) {
            setSupplyFiltersToUse(founderitemsUltraRareDropFilters);
        }
    }, [supplyType]);

    return (
        <div id="FavoriteSupplies">
            <section
                className={`filter-section ${
                    smallDevice ? "small-device" : "large-device"
                }`}
            >
                {!smallDevice && (
                    <>
                        <div className="left">
                            <Title
                                itemsCount={itemsCount}
                                supplyType={
                                    supplyCollectionNameByType[supplyType]
                                }
                            />
                            <SaleTypeDropdown
                                saleType={saleType}
                                handleSaleTypeOnChange={handleSaleTypeOnChange}
                            />
                        </div>
                        <div className="right">
                            <SortTypeDropdown
                                sortType={sortType}
                                handleSortTypeOnChange={handleSortTypeOnChange}
                                isAuction={isAuction}
                                saleType={saleType}
                            />
                            <div className="filter-btn-layout-wrapper">
                                <div className="filter-btn">
                                    <FilterButton
                                        setShowFilterSidebar={
                                            setShowFilterSidebar
                                        }
                                    />
                                </div>

                                <LayoutButtonGroup
                                    handleViewTypeChange={handleViewTypeChange}
                                    viewType={viewType}
                                />
                            </div>
                        </div>
                    </>
                )}
                {smallDevice && (
                    <>
                        <div className="etc-row row-center">
                            <Title
                                itemsCount={itemsCount}
                                supplyType={
                                    supplyCollectionNameByType[supplyType]
                                }
                            />
                        </div>
                        <div className="etc-row">
                            <SaleTypeDropdown
                                saleType={saleType}
                                handleSaleTypeOnChange={handleSaleTypeOnChange}
                            />
                            <div className="filter-btn">
                                <FilterButton
                                    setShowFilterSidebar={setShowFilterSidebar}
                                />
                            </div>
                        </div>
                        <div className="etc-row">
                            <SortTypeDropdown
                                sortType={sortType}
                                handleSortTypeOnChange={handleSortTypeOnChange}
                                isAuction={isAuction}
                                saleType={saleType}
                            />
                            <LayoutButtonGroup
                                handleViewTypeChange={handleViewTypeChange}
                                viewType={viewType}
                            />
                        </div>
                    </>
                )}
            </section>
            <section className="nft-section">
                <Loader show={isFetching} />
                <div className={`nfts ${viewType}`}>
                    {supplies.map((item) => {
                        return viewType === viewTypes.GRID_VIEW ? (
                            <NftCard
                                key={`${item.name}-${item.token_id}`}
                                pathPrefix={`/marketplace/${supplyCollectionPathByType[supplyType]}`}
                                item={item}
                                showAuctionDetail={
                                    saleType === saleTypes.AUCTION
                                }
                            />
                        ) : (
                            <NftDetailCard
                                key={`${item.name}-${item.token_id}`}
                                pathPrefix={`/marketplace/${supplyCollectionPathByType[supplyType]}`}
                                item={item}
                            />
                        );
                    })}
                </div>
                <JumpablePagination
                    currentPage={page}
                    pages={pageCount}
                    onChange={handlePageChange}
                />
            </section>

            <RightDrawerSidebar
                className={`${showFilterSidebar ? "show" : "clear"}`}
            >
                <SuppliesFilterSidebarContent
                    handleClearFilter={handleClearFilter}
                    marketplaces={marketplaces}
                    handleMarketplaceChange={handleMarketplaceChange}
                    handleFiltersChange={handleFiltersChange}
                    selectedFilters={filters}
                    supplyType={supplyType}
                    handleSupplyTypeChange={handleSupplyTypeChange}
                    filters={supplyFiltersToUse}
                />
            </RightDrawerSidebar>
            {showFilterSidebar && (
                <SidebarOverlay
                    onClick={() => {
                        setShowFilterSidebar(false);
                    }}
                />
            )}
        </div>
    );
};

const Title = ({
    supplyType,
    itemsCount,
}: {
    supplyType: string;
    itemsCount: number;
}) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="title">
            <Loading loading={!ready_nft}>
                {itemsCount}{" "}
                {t_nft(supplyType, {
                    defaultValue: supplyType,
                })}
            </Loading>
        </div>
    );
};

export default FavoriteSupplies;
