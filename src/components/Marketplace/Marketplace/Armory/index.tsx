import "./index.scss";

import {
    _didFilterChange,
    getArmoryTypeFromURL,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getPageFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
    getViewTypeFromURL,
} from "../../../../utils/filterUtil";
import {
    allArmoryTypes,
    armoryCollectionAddressByType,
    armoryCollectionNameByType,
    armoryCollectionPathByType,
    armoryTypes,
} from "../../constants/armoryTypes";
import { allSaleTypes, saleTypes } from "../../constants/saleTypes";
import {
    allSortTypes,
    saleSortTypes,
    sharedSortTypes,
    sortTypes,
} from "../../constants/sortTypes";
import { allViewTypes, viewTypes } from "../../constants/viewTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
} from "../../../../state/application/hooks";

import ArmoriesFilterSidebarContent from "../../../widgets/Sidebar/FilterSidebar/ArmoriesFilterSidebarContent";
import CollectionItem from "../../../../state/application/types/CollectionItem";
import FilterButton from "../../Shared/FilterButton";
import JumpablePagination from "../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../Shared/LayoutButtonGroup";
import Loader from "../../../widgets/Loader";
import Loading from "../../../widgets/Loading";
import MarketplaceType from "../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType";
import MarketplaceUtilModel from "../../../../models/util_models/MarketplaceUtilModel";
import NftCard from "../../../widgets/Card/NftCard";
import NftDetailCard from "../../../widgets/Card/NftDetailCard";
import RightDrawerSidebar from "../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../Shared/SortTypeDropdown";
import armoryFilters from "../../constants/armoryFilters";
import { blockchains } from "../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { fetchCollectionItems } from "../../../../apis/web/web.api";
import { founderitemsArmoryFilters } from "../../constants/foundersItemsFilters";
import { softEqual } from "../../../../utils/ArrayUtil";
import { useMediaQuery } from "@mui/material";
import useMobileLayout from "../../../../hooks/useMobileLayout";
import { useNavigate } from "react-router";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

const params = new URLSearchParams(window.location.search);
const allMarketplaces = MarketplaceUtilModel.ALL_MARKETPLACE_TYPES;
const marketplaceTypes = MarketplaceUtilModel.MARKETPLACE_TYPES;

function getQueryStringFromStates({
    saleType,
    sortType,
    page,
    viewType,
    marketplaces,
    filters,
    armoryType,
    armoryFiltersToUse,
}: {
    saleType: string;
    sortType: string;
    page: number;
    viewType: string;
    marketplaces: Array<string>;
    filters: Record<string, Array<string>>;
    armoryType: string;
    armoryFiltersToUse: Record<string, Array<string>>;
}) {
    const baseURI = "/marketplace/armory";
    const queryStrings = [] as Array<string>;
    const _params = new URLSearchParams(window.location.search);
    const isAuction = saleType === saleTypes.AUCTION;

    if (page >= 1) {
        queryStrings.push(`page=${page}`);
    }
    if (saleType !== saleTypes.FOR_SALE && allSaleTypes.includes(saleType)) {
        queryStrings.push(`saleType=${saleType}`);
    }
    if (allSortTypes.includes(sortType)) {
        queryStrings.push(`sortType=${sortType}`);
    }
    if (allViewTypes.includes(viewType)) {
        queryStrings.push(`viewType=${viewType}`);
    }
    if (allArmoryTypes.includes(armoryType)) {
        queryStrings.push(`armoryType=${armoryType}`);
    }

    // Marketplace
    const isPreviousAuction = _params.get("saleType") === saleTypes.AUCTION;
    if (isAuction) {
        queryStrings.push(`marketplaces=${marketplaceTypes.LG_MARKETPLACE}`);
    } else if (isPreviousAuction) {
        queryStrings.push(`marketplaces=${allMarketplaces.join(",")}`);
    } else if (marketplaces.length) {
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
            attributeKey in armoryFiltersToUse &&
            filters[attributeKey].length
        ) {
            const allowedValues = filters[attributeKey]
                .filter((x) => {
                    return armoryFiltersToUse[attributeKey].includes(x);
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

const MarketplaceArmories = () => {
    usePageTitle("Phantasma Marketplace");

    const armoriesPerPage = useNftsPerPage();
    const mobileLayout = useMobileLayout();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.FOR_SALE)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.LOWEST_PRICE)
    );
    const [viewType, setViewType] = useState(getViewTypeFromURL(params));
    const [armoryType, setArmoryType] = useState(getArmoryTypeFromURL(params));
    const [marketplaces, setMarketplaces] = useState(
        getMarketplacesFromURL(params)
    );
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [page, setPage] = useState(getPageFromURL(params));
    const [filters, setFilters] = useState(
        getAttributesFromURL(armoryFilters, params)
    );
    const [armoryFiltersToUse, setArmoryFiltersToUse] = useState<{}>(
        armoryFilters
    );

    const [armories, setArmories] = useState([] as Array<CollectionItem>);
    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:430px)");

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
                armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            sortType,
            viewType,
            marketplaces,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
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
                armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            viewType,
            marketplaces,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
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
                armoryType,
                armoryFiltersToUse,
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
            armoryType,
            navigate,
            armoryFiltersToUse,
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
                armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
        ]
    );
    const handleArmoryTypeChange = useCallback(
        (_armoryType: string) => {
            if (_armoryType === armoryType) {
                return;
            }
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType,
                marketplaces,
                filters,
                armoryType: _armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            viewType,
            filters,
            navigate,
            armoryType,
            armoryFiltersToUse,
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
                armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            viewType,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
        ]
    );

    const handleFiltersChange = useCallback(
        (attribute: string, selectedValues: Array<string>) => {
            const newFilters = cloneDeep(filters);
            if (attribute in filters && attribute in armoryFiltersToUse) {
                const allowedValues = selectedValues.filter((value) => {
                    return armoryFiltersToUse[attribute].includes(value);
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
                armoryType,
                armoryFiltersToUse,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            viewType,
            armoryType,
            navigate,
            armoryFiltersToUse,
        ]
    );

    const handleClearFilter = useCallback(() => {
        const attributeKeys = Object.keys(armoryFiltersToUse);
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
            armoryType,
            armoryFiltersToUse,
        });
        navigate(queryString);
    }, [
        saleType,
        sortType,
        viewType,
        marketplaces,
        armoryType,
        navigate,
        armoryFiltersToUse,
    ]);

    useEffect(() => {
        const params = {
            limit: armoriesPerPage,
            offset: (page - 1) * armoriesPerPage,
            saleType,
            sortType,
            filters,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        fetchCollectionItems({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: armoryCollectionAddressByType[armoryType],
        })
            .then((response: any) => {
                if (mounted) {
                    setArmories(response.data ?? []);
                    setItemsCount(response.total_rows ?? 0);
                    setPageCount(response.pages ?? 0);
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
        saleType,
        sortType,
        page,
        marketplaces,
        filters,
        armoriesPerPage,
        armoryType,
    ]);

    useEffect(() => {
        if (showFilterSidebar) {
            overrideStickiness();
        } else {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const _params = new URLSearchParams(window.location.search);
        const _saleType = getSaleTypeFromURL(_params, saleTypes.FOR_SALE);
        const _sortType = getSortTypeFromURL(
            _params,
            saleSortTypes.LOWEST_PRICE
        );
        const _page = getPageFromURL(_params);
        const _viewType = getViewTypeFromURL(_params);
        const _marketplaces = getMarketplacesFromURL(_params);
        const _filters = getAttributesFromURL(armoryFiltersToUse, _params);
        const _armoryType = getArmoryTypeFromURL(_params);

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

        if (_armoryType !== armoryType) {
            setArmoryType(_armoryType);
        }
    });

    useEffect(() => {
        if (armoryType === armoryTypes.FOUNDERS_ARMORY) {
            setArmoryFiltersToUse(founderitemsArmoryFilters);
        }
    }, [armoryType]);

    return (
        <div id="MarketplaceArmories">
            <section
                className={`filter-section ${
                    smallDevice ? "small-device" : "large-device"
                }`}
            >
                {!smallDevice && (
                    <>
                        <div className="left">
                            <Title
                                collectionName={
                                    armoryCollectionNameByType[armoryType]
                                }
                                itemsCount={itemsCount}
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
                                {mobileLayout && (
                                    <div className="filter-btn">
                                        <FilterButton
                                            setShowFilterSidebar={
                                                setShowFilterSidebar
                                            }
                                        />
                                    </div>
                                )}
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
                                collectionName={
                                    armoryCollectionNameByType[armoryType]
                                }
                                itemsCount={itemsCount}
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
            <div className="content-wrapper">
                {!mobileLayout && (
                    <div id="Sidebar" className="scrollbar">
                        <ArmoriesFilterSidebarContent
                            handleClearFilter={handleClearFilter}
                            marketplaces={marketplaces}
                            handleMarketplaceChange={handleMarketplaceChange}
                            handleFiltersChange={handleFiltersChange}
                            selectedFilters={filters}
                            filters={armoryFiltersToUse}
                            armoryType={armoryType}
                            handleArmoryTypeChange={handleArmoryTypeChange}
                        />
                    </div>
                )}
                <div
                    className={`content scrollbar ${
                        mobileLayout ? "full" : ""
                    }`}
                >
                    <section className="nft-section">
                        <div className={`nfts ${viewType}`}>
                            <Loader show={isFetching} />
                            {(armories ?? []).map((item) => {
                                return viewType === viewTypes.GRID_VIEW ? (
                                    <NftCard
                                        key={`${item.name}-${item.token_id}`}
                                        pathPrefix={`/marketplace/${armoryCollectionPathByType[armoryType]}`}
                                        item={item}
                                        showAuctionDetail={
                                            saleType === saleTypes.AUCTION
                                        }
                                    />
                                ) : (
                                    <NftDetailCard
                                        key={`${item.name}-${item.token_id}`}
                                        pathPrefix={`/marketplace/${armoryCollectionPathByType[armoryType]}`}
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
                </div>
                <RightDrawerSidebar
                    className={`${showFilterSidebar ? "show" : "clear"}`}
                >
                    <ArmoriesFilterSidebarContent
                        handleClearFilter={handleClearFilter}
                        marketplaces={marketplaces}
                        handleMarketplaceChange={handleMarketplaceChange}
                        handleFiltersChange={handleFiltersChange}
                        selectedFilters={armoryFiltersToUse}
                        filters={armoryFiltersToUse}
                        armoryType={armoryType}
                        handleArmoryTypeChange={handleArmoryTypeChange}
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
        </div>
    );
};

const Title = ({
    collectionName,
    itemsCount,
}: {
    collectionName: string;
    itemsCount: number;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });
    return (
        <div className="title">
            {itemsCount}{" "}
            <Loading loading={!ready} width="100px">
                {t(collectionName, { defaultValue: collectionName })}
            </Loading>
        </div>
    );
};

export default MarketplaceArmories;
