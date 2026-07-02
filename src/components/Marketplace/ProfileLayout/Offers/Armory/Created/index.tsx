import "./index.scss";

import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    useMediaQuery,
} from "@mui/material";
import {
    _didFilterChange,
    getArmoryTypeFromURL,
    getAttributesFromURL,
    getMarketplacesFromURL,
    getOfferActionTypeFromURL,
    getOfferTypeFromURL,
    getPageFromURL,
    getSaleTypeFromURL,
    getSortTypeFromURL,
} from "../../../../../../utils/filterUtil";
import {
    allArmoryTypes,
    armoryCollectionAddressByType,
    armoryCollectionNameByType,
    armoryCollectionPathByType,
    armoryTypes,
} from "../../../../constants/armoryTypes";
import { allOfferTypes, offerTypes } from "../../../../constants/offerTypes";
import { allSaleTypes, saleTypes } from "../../../../constants/saleTypes";
import {
    allSortTypes,
    saleSortTypes,
    sharedSortTypes,
    sortTypes,
} from "../../../../constants/sortTypes";
import { cloneDeep, isNumber, isString, isUndefined } from "lodash";
import {
    fetchCreatedNftOffersWithFilters,
    fetchCreatedTokenOffersWithFilters,
} from "../../../../../../apis/web/web.api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useContract,
    useTokenContract,
} from "../../../../../../hooks/useContract";
import {
    useHandleWeb3Error,
    useHandleWeb3Response,
} from "../../../../../../utils/Web3ResponseUtil";
import {
    useNftsPerPage,
    useOverrideNavbarStickiness,
    useResumeNavbarStickiess,
    useView3d,
} from "../../../../../../state/application/hooks";

import ArmoriesFilterSidebarContent from "../../../../../widgets/Sidebar/FilterSidebar/ArmoriesFilterSidebarContent";
import FilterButton from "../../../../Shared/FilterButton";
import JumpablePagination from "../../../../../widgets/JumpablePagination";
import Loader from "../../../../../widgets/Loader";
import Loading from "../../../../../widgets/Loading";
import MarketplaceType from "../../../../../../models/util_models/MarketplaceUtilModel/types/MarketplaceType";
import MarketplaceUtilModel from "../../../../../../models/util_models/MarketplaceUtilModel";
import NftOfferCard from "../../../../../widgets/Card/NftOfferCard";
import NftOfferWithAttributes from "../../../../../../constants/types/NftOfferWithAttributes";
import NftsOfferDetailDialog from "../../../../../shared/NftsOfferDetailDialog";
import OfferABI from "../../../../../../constants/abis/OfferABI";
import RightDrawerSidebar from "../../../../../widgets/Sidebar/RightDrawerSidebar";
import SaleTypeDropdown from "../../../../Shared/SaleTypeDropdown";
import SidebarOverlay from "../../../../../widgets/Overlay/SidebarOverlay";
import SortTypeDropdown from "../../../../Shared/SortTypeDropdown";
import TokenOfferCard from "../../../../../widgets/Card/TokenOfferCard";
import TokenOfferDetailDialog from "../../../../../shared/TokenOfferDetailDialog";
import TokenOfferWithAttributes from "../../../../../../constants/types/TokenOfferWithAttributes";
import Web3 from "web3";
import { activeNode } from "../../../../../../constants/Nodes";
import { allOfferActionTypes } from "../../../../constants/offerActionTypes";
import armoryFilters from "../../../../constants/armoryFilters";
import { blockchains } from "../../../../../../constants/Blockchains";
import { collectionItemImageUrl } from "../../../../../../utils/collectionitemUtils";
import { founderitemsArmoryFilters } from "../../../../constants/foundersItemsFilters";
import { littleGhostsOfferContractAddress } from "../../../../../../constants/ContractAddresses";
import { softEqual } from "../../../../../../utils/ArrayUtil";
import { useActiveWeb3React } from "../../../../../../hooks";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

const params = new URLSearchParams(window.location.search);
const web3 = new Web3(activeNode);
const allMarketplaces = MarketplaceUtilModel.ALL_MARKETPLACE_TYPES;
const marketplaceTypes = MarketplaceUtilModel.MARKETPLACE_TYPES;

function getQueryStringFromStates({
    saleType,
    sortType,
    page,
    marketplaces,
    filters,
    armoryType,
    armoryFiltersToUse,
    offerType,
    offerActionType,
}: {
    saleType: string;
    sortType: string;
    page: number;
    marketplaces: Array<string>;
    filters: Record<string, Array<string>>;
    armoryType: string;
    armoryFiltersToUse: Record<string, Array<string>>;
    offerType: string;
    offerActionType: string;
}) {
    const baseURI = "/marketplace/profile/offers/armory";
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
    if (allArmoryTypes.includes(armoryType)) {
        queryStrings.push(`armoryType=${armoryType}`);
    }

    if (allOfferTypes.includes(offerType)) {
        queryStrings.push(`offerType=${offerType}`);
    }

    if (allOfferActionTypes.includes(offerActionType)) {
        queryStrings.push(`offerActionType=${offerActionType}`);
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

const getOwnerOfToken = async (address, id) => {
    if (!address || !isNumber(id)) {
        return "";
    }
    const abi = [
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ownerOf",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
    ];
    //@ts-ignore
    const Contract = new web3.eth.Contract(abi, address);
    return Contract.methods.ownerOf(id).call();
};

const OffersArmoriesCreated = () => {
    const { account } = useActiveWeb3React();
    const armoriesPerPage = useNftsPerPage();
    const navigate = useNavigate();
    const [saleType, setSaleType] = useState(
        getSaleTypeFromURL(params, saleTypes.ALL)
    );
    const [sortType, setSortType] = useState(
        getSortTypeFromURL(params, saleSortTypes.HIGHEST_RANK)
    );
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

    const [itemsCount, setItemsCount] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const overrideStickiness = useOverrideNavbarStickiness();
    const resumeStickiness = useResumeNavbarStickiess();
    const smallDevice = useMediaQuery("(max-width:430px)");

    const isAuction = useMemo(() => {
        return saleType === saleTypes.AUCTION;
    }, [saleType]);

    //Offers
    const view3d = useView3d();
    const handleWeb3Reponse = useHandleWeb3Response();
    const handleWeb3Error = useHandleWeb3Error();
    const { enqueueSnackbar } = useSnackbar();
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "ProfileSections.Offers",
    });
    const TokenContract = useTokenContract(
        armoryCollectionAddressByType[armoryType],
        true
    );
    const OfferContract = useContract(
        littleGhostsOfferContractAddress,
        OfferABI
    );
    const [createdOffers, setCreatedOffers] = useState(
        [] as Array<TokenOfferWithAttributes> | Array<NftOfferWithAttributes>
    );
    const [offerType, setOfferType] = useState(getOfferTypeFromURL(params));
    const [offerActionType, setOfferActionType] = useState(
        getOfferActionTypeFromURL(params)
    );
    const [ownerAddress, setOwnerAddress] = useState("");
    // Token Offer Detail dialog
    const [tokenOfferDetailDialogOpen, setTokenOfferDetailDialogOpen] =
        useState(false);
    const [selectedOffer, setSelectedOffer] = useState<
        TokenOfferWithAttributes | NftOfferWithAttributes | null
    >(null);
    const handleTokenOfferDetailDialogClose = () => {
        setTokenOfferDetailDialogOpen(false);
    };

    const [isOfferContractApproved, setIsOfferContractApproved] =
        useState(false);

    // NFT Offer Detail dialog
    const [nftOfferDetailDialogOpen, setNftOfferDetailDialogOpen] =
        useState(false);

    const handleNftOfferDetailDialogClose = () => {
        setNftOfferDetailDialogOpen(false);
    };

    const handleOfferTypeChange = useCallback(
        (event: SelectChangeEvent<string>) => {
            const _offerType = event.target.value;
            const queryString = getQueryStringFromStates({
                saleType,
                sortType,
                page: 1,
                marketplaces,
                filters,
                armoryType,
                armoryFiltersToUse,
                offerType: _offerType,
                offerActionType,
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
            offerActionType,
        ]
    );

    const fetchCreatedOffers = useMemo(() => {
        if (offerType === offerTypes.NFT_OFFERS) {
            return fetchCreatedNftOffersWithFilters;
        }
        return fetchCreatedTokenOffersWithFilters;
    }, [offerType]);

    const handleViewOffer = (offer) => {
        setSelectedOffer(offer);
        if (offerType === offerTypes.NFT_OFFERS) {
            setNftOfferDetailDialogOpen(true);
        } else {
            setTokenOfferDetailDialogOpen(true);
        }
    };

    const getCreatedOffers = async () => {
        if (!account) {
            setCreatedOffers([]);
            setPage(1);
            setItemsCount(0);
            setPageCount(0);
            return;
        }
        const params = {
            limit: armoriesPerPage,
            offset: (page - 1) * armoriesPerPage,
            saleType,
            sortType,
            offerType,
            filters,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        await fetchCreatedOffers({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: armoryCollectionAddressByType[armoryType],
            address: account,
        })
            .then((response: any) => {
                if (mounted) {
                    setCreatedOffers(response.data);
                    setItemsCount(response.total_rows);
                    setPageCount(response.pages);
                    setIsFetching(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const accpetTokenOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined(
                (selectedOffer as TokenOfferWithAttributes).tokenOfferId
            )
        ) {
            return;
        }

        await OfferContract?.acceptTokenOffer(
            (selectedOffer as TokenOfferWithAttributes).nftAddress,
            (selectedOffer as TokenOfferWithAttributes).nftId,
            (selectedOffer as TokenOfferWithAttributes).index,
            (selectedOffer as TokenOfferWithAttributes).tokenOfferId
        )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const accpetNftOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined((selectedOffer as NftOfferWithAttributes).nftOfferId)
        ) {
            return;
        }

        await OfferContract?.acceptNFTOffer(
            (selectedOffer as NftOfferWithAttributes).wantedNftAddress,
            (selectedOffer as NftOfferWithAttributes).wantedNftId,
            (selectedOffer as NftOfferWithAttributes).index,
            (selectedOffer as NftOfferWithAttributes).nftOfferId
        )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const cancelTokenOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined(
                (selectedOffer as TokenOfferWithAttributes).tokenOfferId
            )
        ) {
            return;
        }

        await OfferContract?.cancelTokenOffer(
            (selectedOffer as TokenOfferWithAttributes).nftAddress,
            (selectedOffer as TokenOfferWithAttributes).nftId,
            (selectedOffer as TokenOfferWithAttributes).index,
            (selectedOffer as TokenOfferWithAttributes).tokenOfferId
        )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const cancelNftOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined((selectedOffer as NftOfferWithAttributes).nftOfferId)
        ) {
            return;
        }

        await OfferContract?.cancelNFTOffer(
            (selectedOffer as NftOfferWithAttributes).wantedNftAddress,
            (selectedOffer as NftOfferWithAttributes).wantedNftId,
            (selectedOffer as NftOfferWithAttributes).index,
            (selectedOffer as NftOfferWithAttributes).nftOfferId
        )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const rejectTokenOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined(
                (selectedOffer as TokenOfferWithAttributes).tokenOfferId
            )
        ) {
            return;
        }

        await OfferContract?.rejectTokenOffer(
            (selectedOffer as TokenOfferWithAttributes).nftAddress,
            (selectedOffer as TokenOfferWithAttributes).nftId,
            (selectedOffer as TokenOfferWithAttributes).index,
            (selectedOffer as TokenOfferWithAttributes).tokenOfferId
        )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const rejectNftOffer = async () => {
        if (
            !selectedOffer ||
            isUndefined((selectedOffer as NftOfferWithAttributes).nftOfferId)
        ) {
            return;
        }

        await OfferContract?.rejectNFTOffer(
            (selectedOffer as NftOfferWithAttributes).wantedNftAddress,
            (selectedOffer as NftOfferWithAttributes).wantedNftId,
            (selectedOffer as NftOfferWithAttributes).index,
            (selectedOffer as NftOfferWithAttributes).nftOfferId
        )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getCreatedOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
                if (
                    err.data &&
                    err.data.message &&
                    isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    enqueueSnackbar("Updating offers...", { variant: "info" });
                    getCreatedOffers().then(() => {
                        enqueueSnackbar("Offers have been updated", {
                            variant: "success",
                        });
                    });
                }
            });
    };

    const approveOfferContract = async () => {
        await TokenContract?.setApprovalForAll(
            armoryCollectionAddressByType[armoryType],
            true
        )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve offer contract",
                    successMessage:
                        "Offer contract has been successfully approved",
                    res,
                    callback: () => {
                        setIsOfferContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error(err);
            });
    };

    //end offer

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
                marketplaces,
                filters,
                armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
            });
            navigate(queryString);
        },
        [
            sortType,
            marketplaces,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
            offerType,
            offerActionType,
        ]
    );

    const handleSortTypeOnChange = useCallback(
        (evt: any) => {
            const _sortType = evt.target.value;
            const queryString = getQueryStringFromStates({
                saleType,
                sortType: _sortType,
                page: 1,
                marketplaces,
                filters,
                armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
            });
            navigate(queryString);
        },
        [
            saleType,
            marketplaces,
            filters,
            armoryType,
            navigate,
            armoryFiltersToUse,
            offerType,
            offerActionType,
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
                marketplaces,
                filters,
                armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            pageCount,
            armoryType,
            navigate,
            armoryFiltersToUse,
            offerType,
            offerActionType,
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
                marketplaces,
                filters,
                armoryType: _armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
            });
            navigate(queryString);
        },
        [
            saleType,
            sortType,
            marketplaces,
            filters,
            navigate,
            armoryType,
            armoryFiltersToUse,
            offerType,
            offerActionType,
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
                marketplaces: newMarketplaces,
                filters,
                armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
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
            offerType,
            offerActionType,
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
                marketplaces,
                filters: newFilters,
                armoryType,
                armoryFiltersToUse,
                offerType,
                offerActionType,
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
            offerType,
            armoryFiltersToUse,
            offerActionType,
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
            marketplaces,
            filters: filterAttributes,
            armoryType,
            armoryFiltersToUse,
            offerType,
            offerActionType,
        });
        navigate(queryString);
    }, [
        saleType,
        sortType,
        marketplaces,
        armoryType,
        navigate,
        offerType,
        armoryFiltersToUse,
        offerActionType,
    ]);

    useEffect(() => {
        if (showFilterSidebar && overrideStickiness) {
            overrideStickiness();
        } else if (resumeStickiness) {
            resumeStickiness();
        }
    }, [showFilterSidebar, overrideStickiness, resumeStickiness]);

    useEffect(() => {
        if (!account) {
            setCreatedOffers([]);
            setPage(1);
            setItemsCount(0);
            setPageCount(0);
            return () => {};
        }
        const params = {
            limit: armoriesPerPage,
            offset: (page - 1) * armoriesPerPage,
            saleType,
            sortType,
            offerType,
            filters,
        };
        const marketplace = marketplaces.length === 2 ? "all" : marketplaces[0];

        let mounted = true;
        setIsFetching(true);
        fetchCreatedOffers({
            blockchain: blockchains.BSC,
            params,
            marketplace,
            collection: armoryCollectionAddressByType[armoryType],
            address: account,
        })
            .then((response: any) => {
                if (mounted) {
                    setCreatedOffers(response.data);
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
        account,
        armoriesPerPage,
        offerType,
        armoryType,
        fetchCreatedOffers,
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
        const _marketplaces = getMarketplacesFromURL(_params);
        const _filters = getAttributesFromURL(armoryFiltersToUse, _params);
        const _armoryType = getArmoryTypeFromURL(_params);
        const _offerType = getOfferTypeFromURL(_params);
        const _offerActionType = getOfferActionTypeFromURL(_params);

        if (_saleType !== saleType) {
            setSaleType(_saleType);
        }

        if (_sortType !== sortType) {
            setSortType(_sortType);
        }

        if (_page !== page) {
            setPage(_page);
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

        if (_offerType !== offerType) {
            setOfferType(_offerType);
        }

        if (_offerActionType !== offerActionType) {
            setOfferActionType(_offerActionType);
        }
    });

    useEffect(() => {
        if (armoryType === armoryTypes.FOUNDERS_ARMORY) {
            setArmoryFiltersToUse(founderitemsArmoryFilters);
        }
    }, [armoryType]);

    useEffect(() => {
        if (selectedOffer) {
            getOwnerOfToken(
                selectedOffer.nftInfo.address,
                selectedOffer.nftInfo.token_id
            ).then((_address) => {
                setOwnerAddress(_address);
            });
        }
    }, [selectedOffer]);

    return (
        <div id="OffersArmoriesCreated">
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
                                armoryType={
                                    armoryCollectionNameByType[armoryType]
                                }
                            />
                            <SaleTypeDropdown
                                saleType={saleType}
                                handleSaleTypeOnChange={handleSaleTypeOnChange}
                            />
                        </div>
                        <div className="right">
                            <div>
                                <FormControl
                                    variant="outlined"
                                    style={{
                                        minWidth: "160px",
                                    }}
                                >
                                    <Select
                                        value={offerType}
                                        onChange={handleOfferTypeChange}
                                    >
                                        <MenuItem
                                            value={offerTypes.TOKEN_OFFERS}
                                        >
                                            <Loading loading={!ready}>
                                                {t("token_offers", {
                                                    defaultValue:
                                                        "Token Offers",
                                                })}
                                            </Loading>
                                        </MenuItem>
                                        <MenuItem value={offerTypes.NFT_OFFERS}>
                                            <Loading loading={!ready}>
                                                {t("nft_offers", {
                                                    defaultValue: "NFT Offers",
                                                })}
                                            </Loading>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
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
                        </div>
                    </>
                )}
            </section>
            <section className="nft-section">
                <Loader show={isFetching} />
                <div className="offers">
                    {!createdOffers.length && (
                        <div className="text-center pt-3">
                            <h2>
                                <Loading loading={!ready}>
                                    {t("no_offers_found", {
                                        defaultValue: "No Offers Found",
                                    })}
                                </Loading>
                            </h2>
                        </div>
                    )}
                    {createdOffers.map((offer) => {
                        return !isUndefined(offer.nftOfferId) ? (
                            <NftOfferCard
                                key={`${offerType}-${offer.nftOfferId}`}
                                item={offer}
                                pathPrefix={`/marketplace/${armoryCollectionPathByType[armoryType]}`}
                                onView={handleViewOffer}
                            />
                        ) : (
                            <TokenOfferCard
                                key={`${offerType}-${offer.tokenOfferId}`}
                                item={offer}
                                pathPrefix={`/marketplace/${armoryCollectionPathByType[armoryType]}`}
                                onView={handleViewOffer}
                            />
                        );
                    })}
                </div>
                {selectedOffer &&
                    !isUndefined(
                        (selectedOffer as TokenOfferWithAttributes).tokenOfferId
                    ) && (
                        <TokenOfferDetailDialog
                            open={tokenOfferDetailDialogOpen}
                            imageLink={collectionItemImageUrl({
                                item: selectedOffer.nftInfo,
                                view3d,
                            })}
                            onClose={handleTokenOfferDetailDialogClose}
                            onAcceptOffer={accpetTokenOffer}
                            onCancelOffer={cancelTokenOffer}
                            onRejectOffer={rejectTokenOffer}
                            approved={isOfferContractApproved}
                            onApprove={approveOfferContract}
                            offer={selectedOffer as TokenOfferWithAttributes}
                            ownerAddress={ownerAddress}
                        />
                    )}
                {selectedOffer &&
                    !isUndefined(
                        (selectedOffer as NftOfferWithAttributes).nftOfferId
                    ) && (
                        <NftsOfferDetailDialog
                            open={nftOfferDetailDialogOpen}
                            onClose={handleNftOfferDetailDialogClose}
                            onAcceptOffer={accpetNftOffer}
                            onCancelOffer={cancelNftOffer}
                            onRejectOffer={rejectNftOffer}
                            approved={isOfferContractApproved}
                            onApprove={approveOfferContract}
                            offer={selectedOffer as NftOfferWithAttributes}
                            ownerAddress={ownerAddress}
                        />
                    )}

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

export default OffersArmoriesCreated;
