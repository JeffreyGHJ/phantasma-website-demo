import "./index.scss";

import {
    _didFilterChange,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getPageFromURL,
    getPetTypeFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
    getViewTypeFromURL,
} from "../../../../utils/filterUtil";
import {
    allMarketplaces,
    marketplaceTypes,
} from "../../constants/marketplaceTypes";
import {
    allPetTypes,
    petCollectionAddressByType,
    petCollectionNameByType,
    petCollectionPathByType,
} from "../../constants/petTypes";
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
import JumpablePagination from "../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../Shared/LayoutButtonGroup";
import Loader from "../../../widgets/Loader";
import Loading from "../../../widgets/Loading";
import NftCard from "../../../widgets/Card/NftCard";
import NftDetailCard from "../../../widgets/Card/NftDetailCard";
import PetsFilterSidebarContent from "../../../widgets/Sidebar/FilterSidebar/PetsFilterSidebarContent";
import RightDrawerSidebar from "../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../Shared/SortTypeDropdown";
import { blockchains } from "../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { communityWalletAddress } from "../../../../constants/ContractAddresses";
import ectoSkeletonsFilters from "../../constants/ectoSkeletonsFilters";
import { fetchCollectionItems } from "../../../../apis/web/web.api";
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
    petType,
}: {
    saleType: string;
    sortType: string;
    page: number;
    viewType: string;
    marketplaces: Array<string>;
    filters: Record<string, Array<string>>;
    petType: string;
}) {
    const baseURI = "/marketplace/vault/pets";
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
    if (allPetTypes.includes(petType)) {
        queryStrings.push(`petType=${petType}`);
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
            attributeKey in ectoSkeletonsFilters &&
            filters[attributeKey].length
        ) {
            const allowedValues = filters[attributeKey]
                .filter((x) => {
                    return ectoSkeletonsFilters[attributeKey].includes(x);
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

const address = communityWalletAddress;
const VaultPets = () => {
    usePageTitle("Community | Phantasma");

    const petsPerPage = useNftsPerPage();
    const mobileLayout = useMobileLayout();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.ALL)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.HIGHEST_RANK)
    );
    const [viewType, setViewType] = useState(getViewTypeFromURL(params));
    const [petType, setPetType] = useState(getPetTypeFromURL(params));
    const [marketplaces, setMarketplaces] = useState(
        getMarketplacesFromURL(params)
    );
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [page, setPage] = useState(getPageFromURL(params));
    const [filters, setFilters] = useState(
        getAttributesFromURL(ectoSkeletonsFilters, params)
    );

    const [pets, setPets] = useState([] as Array<CollectionItem>);
    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:450px)");

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
                petType,
            });
            navigate(queryString);
        },
        [sortType, viewType, marketplaces, filters, petType, navigate]
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
                petType,
            });
            navigate(queryString);
        },
        [saleType, viewType, marketplaces, filters, petType, navigate]
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
                petType,
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
            petType,
            navigate,
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
                petType,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, filters, petType, navigate]
    );
    const handlePetTypeChange = useCallback(
        (_petType: string) => {
            if (_petType === petType) {
                return;
            }
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                viewType,
                marketplaces,
                filters,
                petType: _petType,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, viewType, filters, navigate, petType]
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
                petType,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, viewType, filters, petType, navigate]
    );

    const handleFiltersChange = useCallback(
        (attribute: string, selectedValues: Array<string>) => {
            const newFilters = cloneDeep(filters);
            if (attribute in filters && attribute in ectoSkeletonsFilters) {
                const allowedValues = selectedValues.filter((value) => {
                    return ectoSkeletonsFilters[attribute].includes(value);
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
                petType,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, filters, viewType, petType, navigate]
    );

    const handleClearFilter = useCallback(() => {
        const attributeKeys = Object.keys(ectoSkeletonsFilters);
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
            petType,
        });
        navigate(queryString);
    }, [saleType, sortType, viewType, marketplaces, petType, navigate]);

    useEffect(() => {
        const params = {
            limit: petsPerPage,
            offset: (page - 1) * petsPerPage,
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
            collection: petCollectionAddressByType[petType],
        })
            .then((response: any) => {
                if (mounted) {
                    setPets(response.data);
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
    }, [saleType, sortType, page, marketplaces, filters, petsPerPage, petType]);

    useEffect(() => {
        if (showFilterSidebar && overrideStickiness) {
            overrideStickiness();
        } else if (resumeStickiness) {
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
        const _filters = getAttributesFromURL(ectoSkeletonsFilters, _params);
        const _petType = getPetTypeFromURL(_params);

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

        if (_petType !== petType) {
            setPetType(_petType);
        }
    });

    return (
        <div id="VaultPets">
            {!mobileLayout && (
                <div id="Sidebar" className="scrollbar">
                    <PetsFilterSidebarContent
                        handleClearFilter={handleClearFilter}
                        marketplaces={marketplaces}
                        handleMarketplaceChange={handleMarketplaceChange}
                        isAuction={isAuction}
                        handleFiltersChange={handleFiltersChange}
                        selectedFilters={filters}
                        petType={petType}
                        handlePetTypeChange={handlePetTypeChange}
                        filters={ectoSkeletonsFilters}
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
                                <Title
                                    collectionName={
                                        petCollectionNameByType[petType]
                                    }
                                    itemsCount={itemsCount}
                                />
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
                            <div className="etc-row row-center">
                                <Title
                                    collectionName={
                                        petCollectionNameByType[petType]
                                    }
                                    itemsCount={itemsCount}
                                />
                            </div>
                            <div className="etc-row ">
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
                        {pets.map((item) => {
                            return viewType === viewTypes.GRID_VIEW ? (
                                <NftCard
                                    key={`${item.name}-${item.token_id}`}
                                    pathPrefix={`/marketplace/${petCollectionPathByType[petType]}`}
                                    item={item}
                                    showAuctionDetail={
                                        saleType === saleTypes.AUCTION
                                    }
                                />
                            ) : (
                                <NftDetailCard
                                    key={`${item.name}-${item.token_id}`}
                                    pathPrefix={`/marketplace/${petCollectionPathByType[petType]}`}
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
                <PetsFilterSidebarContent
                    handleClearFilter={handleClearFilter}
                    marketplaces={marketplaces}
                    handleMarketplaceChange={handleMarketplaceChange}
                    isAuction={isAuction}
                    handleFiltersChange={handleFiltersChange}
                    selectedFilters={filters}
                    petType={petType}
                    handlePetTypeChange={handlePetTypeChange}
                    filters={ectoSkeletonsFilters}
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

export default VaultPets;
