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
} from "../../../../../utils/filterUtil";
import {
    allArmoryTypes,
    armoryCollectionAddressByType,
    armoryCollectionNameByType,
    armoryCollectionPathByType,
    armoryTypes,
} from "../../../constants/armoryTypes";
import { allSaleTypes, saleTypes } from "../../../constants/saleTypes";
import {
    allSortTypes,
    saleSortTypes,
    sharedSortTypes,
    sortTypes,
} from "../../../constants/sortTypes";
import { allViewTypes, viewTypes } from "../../../constants/viewTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useAccountSolanaAssets,
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useUser,
} from "../../../../../state/application/hooks";

import ArmoriesFilterSidebarContent from "../../../../widgets/Sidebar/FilterSidebar/ArmoriesFilterSidebarContent";
import CollectionItem from "../../../../../state/application/types/CollectionItem";
import FilterButton from "../../../Shared/FilterButton";
import JumpablePagination from "../../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../../Shared/LayoutButtonGroup";
import Loader from "../../../../widgets/Loader";
import Loading from "../../../../widgets/Loading";
import Lootbox from "../../../../../models/util_models/LootboxUtilModel/types/Lootbox";
import MarketplaceType from "../../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType";
import MarketplaceUtilModel from "../../../../../models/util_models/MarketplaceUtilModel";
import { Multicall } from "ethereum-multicall";
import NftCard from "../../../../widgets/Card/NftCard";
import NftDetailCard from "../../../../widgets/Card/NftDetailCard";
import RightDrawerSidebar from "../../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../../Shared/SortTypeDropdown";
import Web3 from "web3";
import { activeNode } from "../../../../../constants/Nodes";
import armoryFilters from "../../../constants/armoryFilters";
import { blockchains } from "../../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { fetchCollectionItems } from "../../../../../apis/web/web.api";
import { founderitemsArmoryFilters } from "../../../constants/foundersItemsFilters";
import { softEqual } from "../../../../../utils/ArrayUtil";
import { useActiveWeb3React } from "../../../../../hooks";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import SolanaNftCard from "../../../../widgets/Card/NftCard/SolanaNftCard";

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
    const baseURI = "/marketplace/profile/vault/armory";
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
    if (allArmoryTypes.includes(armoryType)) {
        queryStrings.push(`armoryType=${armoryType}`);
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

const InventoryArmory = () => {
    const armoriesPerPage = useNftsPerPage();
    const { account } = useActiveWeb3React();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.ALL)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.HIGHEST_RANK)
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
    const [armories, setArmories] = useState(
        [] as Array<CollectionItem> | Array<Lootbox>
    );

    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:430px)");

    const isAuction = useMemo(() => {
        return saleType === saleTypes.AUCTION;
    }, [saleType]);

    const solanaAssets = useAccountSolanaAssets();
    const [filteredSOLAssets, setFilteredSolAssets] = useState([]);

    useEffect(() => {
        console.log(solanaAssets);
        if (solanaAssets) {
            const filteredAssets = solanaAssets.filter(
                (item) => item.type === "Weapon" || item.type === "Armor"
            );
            setFilteredSolAssets(filteredAssets);
            setItemsCount(itemsCount + filteredAssets.length);
        }
    }, [solanaAssets]);

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
            armoryType,
            saleType,
            sortType,
            marketplaces,
            viewType,
            filters,
            navigate,
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
        if (showFilterSidebar) {
            overrideStickiness();
        } else {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

    const [evmAccount, setEvmAccount] = useState("");
    const [importedAccount, setImportedAccount] = useState("");
    const user = useUser();

    useEffect(() => {
        if (user) {
            if (user.VaultEVMAddress) {
                setEvmAccount(user.VaultEVMAddress);
            }
            if (user.wallet_addresses && user.wallet_addresses[0]) {
                setImportedAccount(user.wallet_addresses[0].wallet_address);
            }
        }
    }, [user]);

    useEffect(() => {
        const accounts = [account, evmAccount, importedAccount]
            .filter(Boolean)
            .map((item) => item?.toLowerCase())
            .filter((value, index, self) => self.indexOf(value) === index);

        if (accounts.length === 0) {
            setArmories([]);
            setPage(1);
            setPageCount(0);
            return () => {};
        }

        let allItems = [];
        let totalItemsCount = 0;
        let totalPagesCount = 0;

        const fetchItemsForAccount = (currentAccount) => {
            const params = {
                limit: armoriesPerPage,
                offset: (page - 1) * armoriesPerPage,
                saleType,
                sortType,
                ownerAddress: currentAccount,
                filters,
            };
            const marketplace =
                marketplaces.length === 2 ? "all" : marketplaces[0];

            return fetchCollectionItems({
                blockchain: blockchains.BSC,
                params,
                marketplace,
                collection: armoryCollectionAddressByType[armoryType],
            });
        };

        setIsFetching(true);

        Promise.all(accounts.map(fetchItemsForAccount))
            .then((responses) => {
                responses.forEach((response) => {
                    // @ts-ignore
                    allItems = [...allItems, ...response.data];
                    totalItemsCount += response.total_rows;
                    totalPagesCount += response.pages;
                });

                setArmories(allItems);
                setItemsCount(itemsCount + totalItemsCount);
                setPageCount(totalPagesCount);
                setIsFetching(false);
            })
            .catch((error) => {
                console.log(error);
            });

        return () => {};
    }, [
        armoryType,
        saleType,
        sortType,
        page,
        marketplaces,
        filters,
        account,
        evmAccount,
        importedAccount,
        armoriesPerPage,
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
        <div id="InventoryArmory">
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
                                //armoryType={armoryCollectionNameByType[armoryType]}
                                armoryType={"Armory"}
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
                                armoryType={
                                    armoryCollectionNameByType[armoryType]
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
                    {filteredSOLAssets.map((item) => {
                        // @ts-ignore
                        return <SolanaNftCard key={item.id} item={item} />;
                    })}
                    {armories.map((item) => {
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

            <RightDrawerSidebar
                className={`${showFilterSidebar ? "show" : "clear"}`}
            >
                <ArmoriesFilterSidebarContent
                    handleClearFilter={handleClearFilter}
                    marketplaces={marketplaces}
                    handleMarketplaceChange={handleMarketplaceChange}
                    handleFiltersChange={handleFiltersChange}
                    selectedFilters={filters}
                    armoryType={armoryType}
                    handleArmoryTypeChange={handleArmoryTypeChange}
                    filters={armoryFiltersToUse}
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
    armoryType,
    itemsCount,
}: {
    armoryType: string;
    itemsCount: number;
}) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="title">
            <Loading loading={!ready_nft}>
                {itemsCount}{" "}
                {t_nft(armoryType, {
                    defaultValue: armoryType,
                })}
            </Loading>
        </div>
    );
};

export default InventoryArmory;
