import "./index.scss";

import { DexImageTag, ImageTag } from "../../../../../../utils/ImageUtil";
import {
    _didFilterChange,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getPageFromURL,
    getPetTypeFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
    getViewTypeFromURL,
} from "../../../../../../utils/filterUtil";
import {
    allMarketplaces,
    marketplaceTypes,
} from "../../../../constants/marketplaceTypes";
import { allPetTypes, petTypes } from "../../../../constants/petTypes";
import { allSaleTypes, saleTypes } from "../../../../constants/saleTypes";
import {
    allSortTypes,
    saleSortTypes,
    sharedSortTypes,
    sortTypes,
} from "../../../../constants/sortTypes";
import { allViewTypes, viewTypes } from "../../../../constants/viewTypes";
import {
    fetchReceivedOffers,
    syncOffers,
} from "../../../../../../apis/web/web.api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
} from "../../../../../../state/application/hooks";

import AttributeAccordion from "../../../../../widgets/Accordion/AttributeAccordion";
import AttributeAccordionDetails from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionDetails";
import AttributeAccordionSummary from "../../../../../widgets/Accordion/AttributeAccordion/AttributeAccordionSummary";
import Checkbox from "../../../../../widgets/Checkbox/Checkbox";
import CollectionItem from "../../../../../../state/application/types/CollectionItem";
import ControlledCheckboxGroup from "../../../../../widgets/Checkbox/ControlledCheckboxGroup";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import FilterButton from "../../../../Shared/FilterButton";
import IconButton from "../../../../../widgets/Button/IconButton/IconButton";
import JumpablePagination from "../../../../../widgets/JumpablePagination";
import LayoutButtonGroup from "../../../../Shared/LayoutButtonGroup";
import Loader from "../../../../../widgets/Loader";
import Loading from "../../../../../widgets/Loading";
import NftCard from "../../../../../widgets/Card/NftCard";
import NftDetailCard from "../../../../../widgets/Card/NftDetailCard";
import RightDrawerSidebar from "../../../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../../../Shared/SortTypeDropdown";
import { blockchains } from "../../../../../../constants/Blockchains";
import { cloneDeep } from "lodash";
import { ectoSkeletonNFTAddress } from "../../../../../../constants/ContractAddresses";
import ectoSkeletonsFilters from "../../../../constants/ectoSkeletonsFilters";
import { softEqual } from "../../../../../../utils/ArrayUtil";
import { useActiveWeb3React } from "../../../../../../hooks";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router";
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
    const baseURI = "/marketplace/profile/offers/pets";
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
    if (allPetTypes.includes(petType)) {
        queryStrings.push(`petType=${petType}`);
    }

    // Marketplace
    if (isAuction) {
        marketplaces = [marketplaceTypes.LG_MARKETPLACE];
    }
    if (marketplaces.length) {
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

const OffersPetsReceived = () => {
    const { account } = useActiveWeb3React();
    const petsPerPage = useNftsPerPage();
    const { t: t_sidebar, ready: ready_sidebar } = useTranslation(
        "translation",
        {
            keyPrefix: "FilterSidebar",
        }
    );

    const { t: t_traits, ready: ready_traits } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });

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

    const [expanded, setExpanded] = useState<string | false>("panel1");
    const [pets, setPets] = useState([] as Array<CollectionItem>);
    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [petExpanded, setPetExpanded] = useState(true);

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
                petType,
                filters,
            });
            navigate(queryString);
        },
        [saleType, sortType, marketplaces, filters, petType, navigate]
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
        [saleType, sortType, marketplaces, viewType, filters, petType, navigate]
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
        if (!account) {
            setPets([]);
            setPage(1);
            setItemsCount(0);
            setPageCount(0);
            return () => {};
        }
        const params = {
            limit: petsPerPage,
            offset: (page - 1) * petsPerPage,
            saleType,
            sortType,
            ownerAddress: account,
            filters,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        fetchReceivedOffers({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: ectoSkeletonNFTAddress,
            ownerAddress: account,
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
    }, [saleType, sortType, page, marketplaces, filters, account, petsPerPage]);

    useEffect(() => {
        if (showFilterSidebar && overrideStickiness) {
            overrideStickiness();
        } else if (resumeStickiness) {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

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
        <div id="OffersPetsReceived">
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
                        <div className="etc-row">
                            <Title itemsCount={itemsCount} />
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
                    {pets.map((item) => {
                        return viewType === viewTypes.GRID_VIEW ? (
                            <NftCard
                                key={`${item.name}-${item.token_id}`}
                                pathPrefix="/marketplace/skeleton"
                                item={item}
                                showAuctionDetail={
                                    saleType === saleTypes.AUCTION
                                }
                                onClick={() => {
                                    syncOffers(
                                        ectoSkeletonNFTAddress,
                                        item.token_id
                                    );
                                }}
                            />
                        ) : (
                            <NftDetailCard
                                key={`${item.name}-${item.token_id}`}
                                pathPrefix="/marketplace/skeleton"
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
                <div className="sidebar-content">
                    <div className="block">
                        <div className="block-content title">
                            <div className="left">
                                <Loading loading={!ready_sidebar}>
                                    {t_sidebar("filters", {
                                        defaultValue: "Filters",
                                    })}
                                </Loading>
                            </div>
                            <div className="right">
                                <IconButton
                                    onClick={() => {
                                        handleClearFilter();
                                    }}
                                >
                                    <DeleteSweepRoundedIcon fontSize="large" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                    <div className="block">
                        <div className="block-content">
                            <div>
                                <AttributeAccordion
                                    expanded={petExpanded}
                                    onChange={() => {
                                        setPetExpanded(!petExpanded);
                                    }}
                                >
                                    <AttributeAccordionSummary>
                                        <div className="label">
                                            <Loading loading={!ready_sidebar}>
                                                {t_sidebar(
                                                    "petsDropdown.label",
                                                    {
                                                        defaultValue: "Pets",
                                                    }
                                                )}
                                            </Loading>
                                        </div>
                                    </AttributeAccordionSummary>
                                    <AttributeAccordionDetails>
                                        <div className="ms-3 me-3">
                                            <div className="pet-collection">
                                                <Checkbox
                                                    checked={
                                                        petType ===
                                                        petTypes.ECTOSKELETONS
                                                    }
                                                    onChange={() => {
                                                        handlePetTypeChange(
                                                            petTypes.ECTOSKELETONS
                                                        );
                                                    }}
                                                    label={
                                                        <div className="label">
                                                            <ImageTag
                                                                height="25px"
                                                                width="25px"
                                                                src={`${process.env.PUBLIC_URL}/assets/images/icons/Ectoskeletons.png`}
                                                            />
                                                            <span className="ms-1">
                                                                <Loading
                                                                    loading={
                                                                        !ready_sidebar
                                                                    }
                                                                >
                                                                    {t_sidebar(
                                                                        "petsDropdown.selections.EctoSkeletons",
                                                                        {
                                                                            defaultValue:
                                                                                "EctoSkeletons",
                                                                        }
                                                                    )}
                                                                </Loading>
                                                            </span>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </AttributeAccordionDetails>
                                </AttributeAccordion>
                            </div>
                        </div>
                    </div>
                    <div className="block">
                        <div className="block-content">
                            <div>
                                <AttributeAccordion
                                    expanded={expanded === "panel1"}
                                    onChange={handleChange("panel1")}
                                >
                                    <AttributeAccordionSummary>
                                        <div className="label">
                                            <Loading loading={!ready_sidebar}>
                                                {t_sidebar(
                                                    "marketplaceDropdown.label",
                                                    {
                                                        defaultValue:
                                                            "Marketplace",
                                                    }
                                                )}
                                            </Loading>
                                        </div>
                                    </AttributeAccordionSummary>
                                    <AttributeAccordionDetails>
                                        <div className="ms-3 me-3">
                                            <div className="littleghost-mp">
                                                <Checkbox
                                                    checked={marketplaces.includes(
                                                        marketplaceTypes.LG_MARKETPLACE
                                                    )}
                                                    onChange={() => {
                                                        handleMarketplaceChange(
                                                            marketplaceTypes.LG_MARKETPLACE
                                                        );
                                                    }}
                                                    label={
                                                        <div className="label">
                                                            <ImageTag
                                                                height="25px"
                                                                width="25px"
                                                                src={`${process.env.PUBLIC_URL}/logo192.png`}
                                                            />
                                                            <span className="ms-1">
                                                                <Loading
                                                                    loading={
                                                                        !ready_sidebar
                                                                    }
                                                                >
                                                                    {t_sidebar(
                                                                        "marketplaceDropdown.selections.lg",
                                                                        {
                                                                            defaultValue:
                                                                                "LittleGhosts",
                                                                        }
                                                                    )}
                                                                </Loading>
                                                            </span>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                            {!isAuction && (
                                                <div className="pancakeswap-mp mt-4">
                                                    <Checkbox
                                                        checked={marketplaces.includes(
                                                            marketplaceTypes.PANCAKESWAP
                                                        )}
                                                        onChange={() => {
                                                            handleMarketplaceChange(
                                                                marketplaceTypes.PANCAKESWAP
                                                            );
                                                        }}
                                                        label={
                                                            <div className="d-flex">
                                                                <DexImageTag
                                                                    chainID={
                                                                        blockchains.BSC
                                                                    }
                                                                    height={
                                                                        "25px"
                                                                    }
                                                                    width={
                                                                        "25px"
                                                                    }
                                                                />
                                                                <div className="ms-1">
                                                                    <Loading
                                                                        loading={
                                                                            !ready_sidebar
                                                                        }
                                                                    >
                                                                        {t_sidebar(
                                                                            "marketplaceDropdown.selections.pancakeSwap",
                                                                            {
                                                                                defaultValue:
                                                                                    "PancakeSwap",
                                                                            }
                                                                        )}
                                                                    </Loading>
                                                                </div>
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </AttributeAccordionDetails>
                                </AttributeAccordion>
                            </div>
                        </div>
                    </div>
                    {Object.keys(ectoSkeletonsFilters).map((attribute) => {
                        return (
                            <div className="block" key={attribute}>
                                <div className="block-content">
                                    <div>
                                        <AttributeAccordion>
                                            <AttributeAccordionSummary>
                                                <div className="label">
                                                    <Loading
                                                        loading={!ready_traits}
                                                    >
                                                        {t_traits(attribute, {
                                                            defaultValue:
                                                                attribute,
                                                        })}
                                                    </Loading>
                                                </div>
                                            </AttributeAccordionSummary>
                                            <AttributeAccordionDetails className="scrollbar">
                                                <ControlledCheckboxGroup
                                                    className="ms-3 me-3"
                                                    placeholder={t_sidebar(
                                                        "filter",
                                                        {
                                                            defaultValue:
                                                                "Filter",
                                                        }
                                                    )}
                                                    checkboxItems={ectoSkeletonsFilters[
                                                        attribute
                                                    ].map((attr) => {
                                                        return {
                                                            label: (
                                                                <Loading
                                                                    loading={
                                                                        !ready_traits
                                                                    }
                                                                >
                                                                    {t_traits(
                                                                        attr,
                                                                        {
                                                                            defaultValue:
                                                                                attr,
                                                                        }
                                                                    )}
                                                                </Loading>
                                                            ),
                                                            value: attr,
                                                        };
                                                    })}
                                                    onChange={(values) => {
                                                        handleFiltersChange(
                                                            attribute,
                                                            values
                                                        );
                                                    }}
                                                    checkedValues={
                                                        filters[attribute] || []
                                                    }
                                                />
                                            </AttributeAccordionDetails>
                                        </AttributeAccordion>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
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

const Title = ({ itemsCount }: { itemsCount: number }) => {
    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="title">
            <Loading loading={!ready_nft}>
                {itemsCount}{" "}
                {t_nft("EctoSkeletons", {
                    defaultValue: "EctoSkeletons",
                })}
            </Loading>
        </div>
    );
};

export default OffersPetsReceived;
