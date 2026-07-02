import "./index.scss";

import {
    _didFilterChange,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getPageFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
    getViewTypeFromURL,
} from "../../../../utils/filterUtil";
import {
    allMarketplaces,
    marketplaceTypes,
} from "../../constants/marketplaceTypes";
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

import CollectionItem from "../../../../state/application/types/CollectionItem";
import FilterButton from "../../Shared/FilterButton";
import GhostsFilterSidebarContent from "../../../widgets/Sidebar/FilterSidebar/GhostsFilterSidebarContent";
import JumpablePagination from "../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../Shared/LayoutButtonGroup";
import Loader from "../../../widgets/Loader";
import Loading from "../../../widgets/Loading";
import NftCard from "../../../widgets/Card/NftCard";
import NftDetailCard from "../../../widgets/Card/NftDetailCard";
import RightDrawerSidebar from "../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../Shared/SortTypeDropdown";
import { blockchains } from "../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { fetchCollectionItems } from "../../../../apis/web/web.api";
import { littleGhostNFTAddress } from "../../../../constants/ContractAddresses";
import littleGhostsFilters from "../../constants/littleGhostsFilters";
import { softEqual } from "../../../../utils/ArrayUtil";
import { useMediaQuery } from "@mui/material";
import useMobileLayout from "../../../../hooks/useMobileLayout";
import { useNavigate } from "react-router";
import usePageTitle from "../../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

const params = new URLSearchParams(window.location.search);

function getQueryStringFromStates({
    saleType,
    sortType,
    page,
    viewType,
    marketplaces,
    filters,
    ownerAddress,
}: {
    saleType: string;
    sortType: string;
    page: number;
    viewType: string;
    marketplaces: Array<string>;
    filters: Record<string, Array<string>>;
    ownerAddress: string;
}) {
    const baseURI = `/wallet/${ownerAddress}/ghosts`;
    const queryStrings = [] as Array<string>;
    const _params = new URLSearchParams(window.location.search);
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

    // Marketplace
    const isPreviousAuction = _params.get("saleType") === saleTypes.AUCTION;
    if (isAuction) {
        queryStrings.push(`marketplaces=${marketplaceTypes.LG_MARKETPLACE}`);
    } else if (isPreviousAuction) {
        queryStrings.push(`marketplaces=${allMarketplaces.join(",")}`);
    } else if (marketplaces.length) {
        const validMarketplaces: Array<string> = [];
        marketplaces.forEach((marketplace) => {
            if (allMarketplaces.includes(marketplace)) {
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
            attributeKey in littleGhostsFilters &&
            filters[attributeKey].length
        ) {
            const allowedValues = filters[attributeKey]
                .filter((x) => {
                    return littleGhostsFilters[attributeKey].includes(x);
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

const WalletGhosts = ({ address }: { address: string }) => {
    usePageTitle("Phantasma Marketplace");

    const ghostsPerPage = useNftsPerPage();
    const mobileLayout = useMobileLayout();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.ALL)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.HIGHEST_RANK)
    );
    const [viewType, setViewType] = useState(getViewTypeFromURL(params));
    const [marketplaces, setMarketplaces] = useState(
        getMarketplacesFromURL(params)
    );
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [page, setPage] = useState(getPageFromURL(params));
    const [filters, setFilters] = useState(
        getAttributesFromURL(littleGhostsFilters, params)
    );

    const [expanded, setExpanded] = useState<string | false>("panel1");
    const [littleGhosts, setLittleGhosts] = useState(
        [] as Array<CollectionItem>
    );
    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:430px)");

    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

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
                ownerAddress: address,
            });
            navigate(queryString);
        },
        [sortType, viewType, marketplaces, filters, address, navigate]
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
                ownerAddress: address,
            });
            navigate(queryString);
        },
        [saleType, viewType, marketplaces, filters, address, navigate]
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
                ownerAddress: address,
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
            navigate,
            address,
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
                ownerAddress: address,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, filters, address, navigate]
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
                ownerAddress: address,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, viewType, filters, address, navigate]
    );

    const handleFiltersChange = useCallback(
        (attribute: string, selectedValues: Array<string>) => {
            const newFilters = cloneDeep(filters);
            if (attribute in filters && attribute in littleGhostsFilters) {
                const allowedValues = selectedValues.filter((value) => {
                    return littleGhostsFilters[attribute].includes(value);
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
                ownerAddress: address,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, filters, viewType, address, navigate]
    );

    const handleClearFilter = useCallback(() => {
        const attributeKeys = Object.keys(littleGhostsFilters);
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
            ownerAddress: address,
        });
        navigate(queryString);
    }, [saleType, sortType, viewType, marketplaces, address, navigate]);

    useEffect(() => {
        const params = {
            limit: ghostsPerPage,
            offset: (page - 1) * ghostsPerPage,
            saleType,
            sortType,
            filters,
            ownerAddress: address,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        fetchCollectionItems({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: littleGhostNFTAddress,
        })
            .then((response: any) => {
                if (mounted) {
                    setLittleGhosts(response.data);
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
        saleType,
        sortType,
        page,
        marketplaces,
        filters,
        address,
        ghostsPerPage,
    ]);

    useEffect(() => {
        if (showFilterSidebar) {
            overrideStickiness();
        } else {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

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
        const _filters = getAttributesFromURL(littleGhostsFilters, _params);

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
    });

    return (
        <div id="WalletGhosts">
            {!mobileLayout && (
                <div id="Sidebar" className="scrollbar">
                    <GhostsFilterSidebarContent
                        handleClearFilter={handleClearFilter}
                        marketplaces={marketplaces}
                        handleMarketplaceChange={handleMarketplaceChange}
                        isAuction={isAuction}
                        handleFiltersChange={handleFiltersChange}
                        filters={filters}
                    />
                </div>
            )}
            <div className={`content scrollbar ${mobileLayout ? "full" : ""}`}>
                <section
                    className={`filter-section ${
                        smallDevice ? "small-device" : "large-device"
                    }`}
                >
                    {!smallDevice && (
                        <>
                            <div className="left">
                                <Title itemsCount={itemsCount} />
                                <SaleTypeDropdown
                                    saleType={saleType}
                                    handleSaleTypeOnChange={
                                        handleSaleTypeOnChange
                                    }
                                />
                            </div>
                            <div className="right">
                                <SortTypeDropdown
                                    sortType={sortType}
                                    handleSortTypeOnChange={
                                        handleSortTypeOnChange
                                    }
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
                            <div className="etc-row">
                                <Title itemsCount={itemsCount} />
                                <LayoutButtonGroup
                                    handleViewTypeChange={handleViewTypeChange}
                                    viewType={viewType}
                                />
                            </div>
                            <div className="etc-row">
                                <SaleTypeDropdown
                                    saleType={saleType}
                                    handleSaleTypeOnChange={
                                        handleSaleTypeOnChange
                                    }
                                />
                                <div className="filter-btn">
                                    <FilterButton
                                        setShowFilterSidebar={
                                            setShowFilterSidebar
                                        }
                                    />
                                </div>
                            </div>
                            <div className="etc-row">
                                <SortTypeDropdown
                                    sortType={sortType}
                                    handleSortTypeOnChange={
                                        handleSortTypeOnChange
                                    }
                                    isAuction={isAuction}
                                    saleType={saleType}
                                />
                            </div>
                        </>
                    )}
                </section>
                <section className="nft-section">
                    <div className={`nfts ${viewType}`}>
                        {littleGhosts.map((item) => {
                            return viewType === viewTypes.GRID_VIEW ? (
                                <NftCard
                                    key={`${item.name}-${item.token_id}`}
                                    pathPrefix="/marketplace/ghost"
                                    item={item}
                                    showAuctionDetail={
                                        saleType === saleTypes.AUCTION
                                    }
                                />
                            ) : (
                                <NftDetailCard
                                    key={`${item.name}-${item.token_id}`}
                                    pathPrefix="/marketplace/ghost"
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
                    <GhostsFilterSidebarContent
                        handleClearFilter={handleClearFilter}
                        marketplaces={marketplaces}
                        handleMarketplaceChange={handleMarketplaceChange}
                        isAuction={isAuction}
                        handleFiltersChange={handleFiltersChange}
                        filters={filters}
                    />
                </RightDrawerSidebar>
                {showFilterSidebar && (
                    <SidebarOverlay
                        onClick={() => {
                            setShowFilterSidebar(false);
                        }}
                    />
                )}
                <Loader show={isFetching} />
            </div>
        </div>
    );
};

const Title = ({ itemsCount }: { itemsCount: number }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });
    return (
        <div className="title">
            {itemsCount}{" "}
            <Loading loading={!ready} width="100px">
                {t("LittleGhosts", { defaultValue: "LittleGhosts" })}
            </Loading>
        </div>
    );
};

export default WalletGhosts;
