import "./index.scss";

import { Divider, Grid, Menu, MenuItem, Tab, Tabs } from "@mui/material";
import {
    SingleCollectionItem,
    SingleCollectionItemAuction,
} from "../../../state/application/types/SingleCollectionItem";
import _, { isUndefined } from "lodash";
import {
    busdTokenAddress,
    ectoContractAddress,
    littleGhostAuctionContractAddress,
    littleGhostsMarketContractAddress,
    littleGhostsOfferContractAddress,
    lootboxContractAddress,
    pancakeSwapNftMarketContractAddress,
    wbnbTokenAddress,
} from "../../../constants/ContractAddresses";
import {
    fromSolidityTokenFormat,
    solidityTokenFormat,
} from "../../../utils/MathUtil";
import {
    getCurrentBid,
    getCurrentBiddingPriceInUsd,
} from "../../../utils/AuctionUtil";
import {
    getNftDisplay,
    getPaymentTokenDecimals,
    getPaymentTokenDisplay,
    getTokenPriceInUsd,
} from "../../../utils/funcs";
import {
    useBnbPriceInUsd,
    useEctoPriceInUsd,
    useUpdateOverlay,
    useUser,
    useView3d,
} from "../../../state/application/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useContract, useTokenContract } from "../../../hooks/useContract";
import {
    useHandleWeb3Error,
    useHandleWeb3Response,
} from "../../../utils/Web3ResponseUtil";
import { useNavigate, useParams } from "react-router-dom";

import { AbiItem } from "web3-utils";
import AccountFavoredNftModel from "../../../models/AccountFavoredNftModel";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AuctionDialog from "../../shared/AuctionDialog/AuctionDialog";
import BackspaceIcon from "@mui/icons-material/Backspace";
import BiddingDialog from "../../shared/BiddingDialog/BiddingDialog";
import BuyoutDialog from "../../shared/BuyoutDialog/BuyoutDialog";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import EditIcon from "@mui/icons-material/Edit";
import Erc20UtilModel from "../../../models/util_models/Erc20UtilModel";
import ExternalLink from "../../widgets/ExternalLink/ExternalLink";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GavelIcon from "@mui/icons-material/Gavel";
import HoverTooltip from "../../widgets/Tooltip/HoverTooltip";
import IconButton from "../../widgets/Button/IconButton/IconButton";
import { ImageTag } from "../../../utils/ImageUtil";
import Input from "../../widgets/Input";
import InternalLink from "../../widgets/InternalLink";
import ListItemDialog from "../../shared/ListDialog";
import Loader from "../../widgets/Loader";
import Loading from "../../widgets/Loading";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LootboxSingleItem from "../../../models/util_models/LootboxUtilModel/types/LootboxSingleItem";
import LootboxUtilModel from "../../../models/util_models/LootboxUtilModel";
import { MarketplaceLogoInternalLink } from "../../widgets/Image/MarketplaceLogoInternalLink";
import MarketplaceUtilModel from "../../../models/util_models/MarketplaceUtilModel";
import MinimumOfferDialog from "../../shared/MinimumOfferDialog";
import NftCollectionModel from "../../../models/NftCollectionModel";
import NftOffer from "../../../constants/types/NftOffer";
import NftsOfferDetailDialog from "../../shared/NftsOfferDetailDialog";
import NftsOfferDialog from "../../shared/NftsOfferDialog/NftsOfferDialog";
import OfferABI from "../../../constants/abis/OfferABI";
import OutlinedButton from "../../widgets/Button/OutlinedButton";
import QuickSetting from "../../widgets/SpeedDial/QuickSetting";
import { RECAPTCHA_INVISIBLE_SITE_KEY, RECAPTCHA_ENABLED } from "../../../constants/recaptchaSiteKeys";
import ReCAPTCHA from "react-google-recaptcha";
import RewardSpinDialog from "../../shared/RewardSpinDialog";
import RouteUtilModel from "../../../models/util_models/RouteUtilModel";
import SearchIcon from "@mui/icons-material/Search";
import SendNftDialog from "../../shared/SendNftDialog";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import TokenOffer from "../../../constants/types/TokenOffer";
import TokenOfferDetailDialog from "../../shared/TokenOfferDetailDialog";
import TokenOfferDialog from "../../shared/TokenOfferDialog";
import Web3 from "web3";
import { activeNode } from "../../../constants/Nodes";
import { assetCollectionAddressMap } from "./constant";
import auctionABI from "../../../constants/abis/auctionABI";
import { blockchains } from "../../../constants/Blockchains";
import cogoToast from "cogo-toast";
import { collectionItemImageUrl } from "../../../utils/collectionitemUtils";
import { fetchCollectionitem } from "../../../apis/web/web.api";
import { getLootbox } from "../../../constants/abis/bsc/LootboxABI/hooks/useGetLootbox";
import { getOwnerOfToken } from "../../../hooks/contract/useOwnerOfToken";
import { isAddress } from "../../../utils";
import { isLootboxApprovedForClaim } from "../../../constants/abis/bsc/LootboxABI/hooks/useIsLootboxApprovedForClaim";
import { marketplaceTypes } from "../constants/marketplaceTypes";
import pancakeSwapNFTMarketABI from "../../../constants/PancakeSwapNFTMarketABI";
import recaptchaTypes from "../../../constants/recaptchaTypes";
import { toastOptions } from "../../../configs/CogoToast";
import { useActiveWeb3React } from "../../../hooks";
import { useApproveClaimLootboxReward } from "../../../constants/abis/bsc/LootboxABI/hooks/useApproveClaimLootboxReward";
import { useClaimLootboxReward } from "../../../constants/abis/bsc/LootboxABI/hooks/useClaimLootboxReward";
import { useOpenLootbox } from "../../../constants/abis/bsc/LootboxABI/hooks/useOpenLootbox";
import usePageTitle from "../../../hooks/usePageTitle";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { weiToBnb } from "../../../utils/UnitUtil";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const web3 = new Web3(activeNode);

const OFFER_MENU_ITEMS = {
    TOKENS: 1,
    NFT: 2,
};

const LISTING_MENU_ITEMS = {
    LG_MARKETPLACE: 1,
    PANCAKE_MARKETPLACE: 2,
    AUCTION: 3,
};

const getAuctionExpireDisplay = (item, currentTime) => {
    const expireTime = +item.endBlock * 1000;
    if (expireTime <= currentTime) {
        return "Expired";
    }
    return ((expireTime - currentTime) / 1000 / 60 / 60).toFixed(2);
};

const getBuyoutPriceInUsd = (_item, _ectoPrice, _bnbPrice) => {
    const address = _item.paymentToken.toLowerCase();
    if (address === ectoContractAddress.toLowerCase()) {
        return +fromSolidityTokenFormat(_item.price, 9) * _ectoPrice;
    } else if (address === busdTokenAddress.toLowerCase()) {
        return +fromSolidityTokenFormat(_item.price, 18);
    } else if (address === wbnbTokenAddress.toLowerCase()) {
        return +fromSolidityTokenFormat(_item.price, 18) * _bnbPrice;
    }
    return "0";
};

const isAuctionExpired = (auction) => {
    if (!auction) {
        return false;
    }
    const expireTime = +auction.endBlock * 1000;
    if (expireTime <= new Date().getTime()) {
        return true;
    }
    return false;
};

const OFFER_TABS = {
    TOKEN: 0,
    NFT: 1,
};

const CollectionItem = () => {
    usePageTitle("Phantasma Marketplace");
    const navigate = useNavigate();
    const handleWeb3Error = useHandleWeb3Error();
    const handleWeb3Reponse = useHandleWeb3Response();
    const { enqueueSnackbar } = useSnackbar();
    const updateOverlay = useUpdateOverlay();

    // #region (Global state)
    const view3d = useView3d();
    const bnbPrice = useBnbPriceInUsd();
    const ectoPrice = useEctoPriceInUsd();
    // #endregion

    // #region (User)
    const { account, chainId } = useActiveWeb3React();
    const [userOwnItem, setUserOwnItem] = useState(false);
    // #endregion

    // #region (URL State)
    const { asset, id } = useParams();
    // #endregion

    // #region (Item)
    const [item, setItem] = useState<
        null | SingleCollectionItem | LootboxSingleItem
    >();
    const collectionAddress: string = useMemo(() => {
        if (asset && assetCollectionAddressMap[asset]) {
            return assetCollectionAddressMap[asset];
        }
        return "";
    }, [asset]);
    const [ownerAddress, setOwnerAddress] = useState<
        undefined | null | string
    >();
    const [listedPrice, setListedPrice] = useState("0");
    const [isItemListed, setIsItemListed] = useState(false);
    const [isItemOnAuction, setisItemOnAuction] = useState(false);
    const [biddingHistory, setBiddingHistory] = useState([] as Array<bigint>);
    // #endregion

    // #region (Translation)
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });
    // #endregion

    // #region (Page state)
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [searchId, setSearchId] = useState(id || 0);
    const [showIdSearch, setShowIdSearch] = useState(false);
    const handleOnSearchIdSubmit = useCallback(
        (evt?: React.FormEvent<HTMLFormElement>) => {
            if (evt) {
                evt.preventDefault();
            }
            if (!collectionAddress) {
                return;
            }
            // Validation
            if (item) {
                if (searchId && searchId === item.id) {
                    enqueueSnackbar(
                        t("ERROR_MESSAGES.You_are_already_here", {
                            defaultValue: "You_are_already_here",
                        }),
                        {
                            variant: "error",
                        }
                    );
                    return;
                } else if (+searchId < 0 || +searchId > item.collection_total) {
                    enqueueSnackbar("ID out of range", { variant: "error" });
                    return;
                }
            }
            navigate(`/marketplace/${asset}/${searchId}`);
        },
        [searchId, item, collectionAddress, asset, navigate, enqueueSnackbar, t]
    );
    const handleOnSearchIconClick = useCallback(() => {
        if (!showIdSearch) {
            setShowIdSearch(true);
            return;
        }
        handleOnSearchIdSubmit();
    }, [showIdSearch, setShowIdSearch, handleOnSearchIdSubmit]);
    const handleOnSearchIdChange = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            setSearchId(+evt.currentTarget.value);
        },
        [setSearchId]
    );
    // #endregion

    // #region (Contracts)
    const auctionContract = useContract(
        littleGhostAuctionContractAddress,
        auctionABI
    );
    const offerContract = useContract(
        littleGhostsOfferContractAddress,
        OfferABI
    );
    const wbnbTokenContract = useTokenContract(wbnbTokenAddress);
    const ectoTokenContract = useTokenContract(ectoContractAddress);
    const busdTokenContract = useTokenContract(busdTokenAddress);
    const marketContract = useTokenContract(
        littleGhostsMarketContractAddress,
        true
    );
    const pancakeMarketContract = useContract(
        pancakeSwapNftMarketContractAddress,
        pancakeSwapNFTMarketABI,
        true
    );
    const CollectionContract = useTokenContract(collectionAddress, true);
    const [
        isLittleGhostMarketplaceContractApproved,
        setIsLittleGhostMarketplaceContractApproved,
    ] = useState(false);
    const [
        isLittleGhostOfferContractApproved,
        setIsLittleGhostOfferContractApproved,
    ] = useState(false);
    const [
        isPancakeSwapMarketplaceContractApproved,
        setIsPancakeSwapMarketplaceContractApproved,
    ] = useState(false);
    const [
        isLittleGhostAuctionContractApproved,
        setIsLittleGhostAuctionContractApproved,
    ] = useState(false);

    const [isWbnbApprovedForAuction, setIsWbnbApprovedForAuction] =
        useState(false);
    const [isEctoApprovedForAuction, setIsEctoApprovedForAuction] =
        useState(false);
    const [isBusdApprovedForAuction, setIsBusdApprovedForAuction] =
        useState(false);

    const approveMarketplaceContract = async () => {
        //@ts-ignore
        await CollectionContract.setApprovalForAll(
            littleGhostsMarketContractAddress,
            true
        )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve the contract",
                    successMessage: "Contract has been successfully approved",
                    res,
                    callback: () => {
                        setIsLittleGhostMarketplaceContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approveOfferContract = async () => {
        //@ts-ignore
        await CollectionContract.setApprovalForAll(
            littleGhostsOfferContractAddress,
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
                        setIsLittleGhostOfferContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approvePancakeMarketplaceContract = async () => {
        //@ts-ignore
        await CollectionContract.setApprovalForAll(
            pancakeSwapNftMarketContractAddress,
            true
        )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve the contract",
                    successMessage: "Contract has been successfully approved",
                    res,
                    callback: () => {
                        setIsPancakeSwapMarketplaceContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approveAuctionContract = async () => {
        //@ts-ignore
        await CollectionContract.setApprovalForAll(
            littleGhostAuctionContractAddress,
            true
        )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage:
                        "Waiting for confirmations to approve the contract",
                    successMessage: "Contract has been successfully approved",
                    res,
                    callback: () => {
                        setIsLittleGhostAuctionContractApproved(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approveWbnbForAuctionContract = async () => {
        //@ts-ignore
        await wbnbTokenContract
            .approve(
                littleGhostAuctionContractAddress,
                Erc20UtilModel.MAX_ALLOWANCE
            )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: "Waiting for WBNB approval",
                    successMessage: "WBNB has successfully been approved",
                    res,
                    callback: () => {
                        setIsWbnbApprovedForAuction(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approveEctoForAuctionContract = async () => {
        //@ts-ignore
        await ectoTokenContract
            .approve(
                littleGhostAuctionContractAddress,
                Erc20UtilModel.MAX_ALLOWANCE
            )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: "Waiting for ECTO approval",
                    successMessage: "ECTO has successfully been approved",
                    res,
                    callback: () => {
                        setIsEctoApprovedForAuction(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const approveBusdForAuctionContract = async () => {
        //@ts-ignore
        await busdTokenContract
            .approve(
                littleGhostAuctionContractAddress,
                Erc20UtilModel.MAX_ALLOWANCE
            )
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: "Waiting for BUSD approval",
                    successMessage: "BUSD has successfully been approved",
                    res,
                    callback: () => {
                        setIsBusdApprovedForAuction(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    /**
     * @return {Promise<boolean>}
     */
    const checkIfMarketplaceContractIsApproved = async () => {
        if (!account) {
            return;
        }
        //@ts-ignore
        return CollectionContract.isApprovedForAll(
            account,
            littleGhostsMarketContractAddress
        )
            .then((res) => {
                setIsLittleGhostMarketplaceContractApproved(res);
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const checkIfOfferContractIsApproved = async () => {
        if (!account) {
            return;
        }
        //@ts-ignore
        return CollectionContract.isApprovedForAll(
            account,
            littleGhostsOfferContractAddress
        )
            .then((res) => {
                setIsLittleGhostOfferContractApproved(res);
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    /**
     * @return {Promise<boolean>}
     */
    const checkIfPancakeSwapMarketplaceContractIsApproved = async () => {
        if (!account) {
            return;
        }
        //@ts-ignore
        return CollectionContract.isApprovedForAll(
            account,
            pancakeSwapNftMarketContractAddress
        )
            .then((res) => {
                setIsPancakeSwapMarketplaceContractApproved(res);
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    /**
     * @return {Promise<boolean>}
     */
    const checkIfAuctionContractIsApproved = async () => {
        if (!account) {
            return;
        }
        //@ts-ignore
        return CollectionContract.isApprovedForAll(
            account,
            littleGhostAuctionContractAddress
        )
            .then((res) => {
                setIsLittleGhostAuctionContractApproved(res);
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const checkIfWbnbIsApprovedForAuction = async () => {
        if (!account) {
            return;
        }

        //@ts-ignore
        const allowance = await wbnbTokenContract.allowance(
            account,
            littleGhostAuctionContractAddress
        );

        if (+allowance < +Erc20UtilModel.MAX_ALLOWANCE) {
            setIsWbnbApprovedForAuction(false);
        } else {
            setIsWbnbApprovedForAuction(true);
        }
    };

    const checkIfEctoIsApprovedForAuction = async () => {
        if (!account) {
            return;
        }

        //@ts-ignore
        const allowance = await ectoTokenContract.allowance(
            account,
            littleGhostAuctionContractAddress
        );

        if (+allowance < +Erc20UtilModel.MAX_ALLOWANCE) {
            setIsEctoApprovedForAuction(false);
        } else {
            setIsEctoApprovedForAuction(true);
        }
    };

    const checkIfBusdIsApprovedForAuction = async () => {
        if (!account) {
            return;
        }

        //@ts-ignore
        const allowance = await busdTokenContract.allowance(
            account,
            littleGhostAuctionContractAddress
        );

        if (+allowance < +Erc20UtilModel.MAX_ALLOWANCE) {
            setIsBusdApprovedForAuction(false);
        } else {
            setIsBusdApprovedForAuction(true);
        }
    };

    const checkIfLootboxIsApprovedForClaim = useCallback(async () => {
        if (!account) {
            setIsLootboxApprovedToClaim(false);
            return;
        }
        isLootboxApprovedForClaim({ account }).then((_approved) => {
            setIsLootboxApprovedToClaim(_approved);
        });
    }, [account]);
    //#endregion

    // #region (Fixed Listing)
    const [fixedListingDialogOpen, setFixedListingDialogOpen] = useState(false);
    const handleFixedListingDialogClose = () => {
        setFixedListingDialogOpen(false);
    };
    const [marketplaceToList, setMarketplaceToList] = useState(
        LISTING_MENU_ITEMS.LG_MARKETPLACE
    );
    const listOrModifyPrice = (listPriceInBnb) => {
        if (!listedPrice) {
            if (marketplaceToList === LISTING_MENU_ITEMS.LG_MARKETPLACE) {
                listItemOnMarketplace(listPriceInBnb);
            } else {
                listItemOnPancakeMarketplace(listPriceInBnb);
            }
        } else {
            updateAskPrice(listPriceInBnb);
        }
    };
    const listItemOnMarketplace = async (listPriceInBnb) => {
        // price validation
        if (!_.isNumber(listPriceInBnb)) {
            cogoToast.error("Invalid price", toastOptions);
            return;
        }
        if (+listPriceInBnb < 0.0005 || +listPriceInBnb > 10000) {
            cogoToast.error("List price not within range..", toastOptions);
            return;
        }
        const wei = web3.utils.toWei(listPriceInBnb.toString());
        //@ts-ignore
        await marketContract
            .createAskOrder(collectionAddress, id, wei)
            .then((res, rej) => {
                setFixedListingDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to list #${id}`,
                    successMessage: `#${id} is successfully listed for ${listPriceInBnb.toFixed(
                        3
                    )} BNB.`,
                    res,
                    callback: async () => {
                        setIsItemListed(true);
                        setListedPrice(wei);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const listItemOnPancakeMarketplace = async (listPriceInBnb) => {
        // price validation
        if (!_.isNumber(listPriceInBnb)) {
            cogoToast.error("Invalid price", toastOptions);
            return;
        }
        if (+listPriceInBnb < 0.0005 || +listPriceInBnb > 10000) {
            cogoToast.error("List price not within range..", toastOptions);
            return;
        }
        const wei = web3.utils.toWei(listPriceInBnb.toString());
        //@ts-ignore
        await pancakeMarketContract
            .createAskOrder(collectionAddress, id, wei)
            .then((res, rej) => {
                setFixedListingDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to list #${id}`,
                    successMessage: `#${id} is successfully listed for ${listPriceInBnb.toFixed(
                        3
                    )} BNB.`,
                    res,
                    callback: async () => {
                        setIsItemListed(true);
                        setListedPrice(wei);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const buyItem = async () => {
        if (
            !item ||
            !item.marketplace ||
            ![
                marketplaceTypes.LG_MARKETPLACE,
                marketplaceTypes.PANCAKESWAP,
            ].includes(item.marketplace)
        ) {
            return;
        }
        const contract =
            item.marketplace === marketplaceTypes.LG_MARKETPLACE
                ? marketContract
                : pancakeMarketContract;
        //@ts-ignore
        await contract
            ?.buyTokenUsingBNB(collectionAddress, id, {
                value: listedPrice,
            })
            .then(async (res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to purchase #${id}.`,
                    successMessage: `You have successfully bought #${id}.`,
                    res,
                    callback: async () => {
                        setOwnerAddress(account);
                        setIsItemListed(false);
                        setListedPrice("0");
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const updateAskPrice = async (listPriceInBnb) => {
        if (!item) {
            return;
        }
        // price validation
        if (!_.isNumber(listPriceInBnb) || listPriceInBnb < 0.0005) {
            cogoToast.error("Invalid price", toastOptions);
            return;
        }
        const wei = (listPriceInBnb * 1000000000000000000).toString();

        const contract =
            item.marketplace === marketplaceTypes.LG_MARKETPLACE
                ? marketContract
                : pancakeMarketContract;
        //@ts-ignore
        await contract
            .modifyAskOrder(collectionAddress, id, wei)
            .then((res) => {
                setFixedListingDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to update list price for #${id}`,
                    successMessage: `Price for #${id} is successfully updated to ${listPriceInBnb.toFixed(
                        3
                    )} BNB.`,
                    res,
                    callback: () => {
                        setListedPrice(wei);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const unlistItemFromMarketplace = async () => {
        if (!item) {
            return;
        }
        const contract =
            item.marketplace === marketplaceTypes.LG_MARKETPLACE
                ? marketContract
                : pancakeMarketContract;

        //@ts-ignore
        await contract
            .cancelAskOrder(collectionAddress, id)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to unlist #${id}`,
                    successMessage: `#${id} is successfully unlisted.`,
                    res,
                    callback: async () => {
                        setIsItemListed(false);
                        setListedPrice("0");
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    //Listing
    const [listingAnchorEl, setListingAnchorEl] = useState(null);
    const handleListingMenuClose = (menuItem: number) => {
        if (
            menuItem === LISTING_MENU_ITEMS.LG_MARKETPLACE ||
            menuItem === LISTING_MENU_ITEMS.PANCAKE_MARKETPLACE
        ) {
            if (menuItem === LISTING_MENU_ITEMS.LG_MARKETPLACE) {
                setMarketplaceToList(LISTING_MENU_ITEMS.LG_MARKETPLACE);
            } else {
                setMarketplaceToList(LISTING_MENU_ITEMS.PANCAKE_MARKETPLACE);
            }
            setFixedListingDialogOpen(true);
        } else if (menuItem === LISTING_MENU_ITEMS.AUCTION) {
            setAuctionDialogOpen(true);
        }
        setListingAnchorEl(null);
    };

    const handleListingClick = (event) => {
        setListingAnchorEl(event.currentTarget);
    };
    // #endregion

    // #region (Offer)
    const [tokenOffers, setTokenOffers] = useState([] as Array<TokenOffer>);
    const [nftOffers, setNftOffers] = useState([] as Array<NftOffer>);
    const [offerAnchorEl, setOfferAnchorEl] = useState<
        null | (EventTarget & HTMLButtonElement)
    >(null);
    const [offerTab, setOfferTab] = useState(OFFER_TABS.TOKEN);
    const handleOfferTabChange = (event, newValue) => {
        setOfferTab(newValue);
    };
    const handleOfferMenuClose = (menuItem: number) => {
        if (menuItem === OFFER_MENU_ITEMS.TOKENS) {
            setTokenOfferDialogOpen(true);
        } else if (menuItem === OFFER_MENU_ITEMS.NFT) {
            setNftsOfferDialogOpen(true);
        }
        setOfferAnchorEl(null);
    };

    const handleOfferClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setOfferAnchorEl(event.currentTarget);
    };

    const createTokenOffer = async ({ paymentToken, offerAmount }) => {
        await offerContract
            ?.createTokenOffer(
                collectionAddress,
                id,
                paymentToken.tokenAddress,
                solidityTokenFormat(offerAmount, paymentToken.decimals)
            )
            .then((res, rej) => {
                setTokenOfferDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to create offer for #${id}`,
                    successMessage: `Offer is successfully created for #${id}.`,
                    res,
                    callback: async () => {
                        getTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const cancelNftOffer = async () => {
        //@ts-ignore
        await offerContract
            .cancelNFTOffer(
                collectionAddress,
                id,
                selectedNftOfferIndex,
                selectedNftOffer?.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const accpetNftOffer = async () => {
        //@ts-ignore
        await offerContract
            .acceptNFTOffer(
                collectionAddress,
                id,
                selectedNftOfferIndex,
                selectedNftOffer?.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getNftOffers();
                        setOwnerAddress(selectedNftOffer?.buyer);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const rejectNftOffer = async () => {
        //@ts-ignore
        await offerContract
            .rejectNFTOffer(
                collectionAddress,
                id,
                selectedNftOfferIndex,
                selectedNftOffer?.nftOfferId
            )
            .then((res) => {
                setNftOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setNftOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getNftOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const accpetTokenOffer = async () => {
        //@ts-ignore
        await offerContract
            .acceptTokenOffer(
                collectionAddress,
                id,
                selectedTokenOfferIndex,
                selectedTokenOffer?.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to accept offer`,
                    successMessage: `Offer is successfully accepted.`,
                    res,
                    callback: async () => {
                        getTokenOffers();
                        setOwnerAddress(selectedTokenOffer?.buyer);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getTokenOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const rejectTokenOffer = async () => {
        //@ts-ignore
        await offerContract
            .rejectTokenOffer(
                collectionAddress,
                id,
                selectedTokenOfferIndex,
                selectedTokenOffer?.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to reject offer`,
                    successMessage: `Offer is successfully rejected.`,
                    res,
                    callback: async () => {
                        getTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getTokenOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const cancelTokenOffer = async () => {
        //@ts-ignore
        await offerContract
            .cancelTokenOffer(
                collectionAddress,
                id,
                selectedTokenOfferIndex,
                selectedTokenOffer?.tokenOfferId
            )
            .then((res) => {
                setTokenOfferDetailDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel offer`,
                    successMessage: `Offer is successfully cancelled.`,
                    res,
                    callback: async () => {
                        getTokenOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
                if (
                    err.data &&
                    err.data.message &&
                    _.isString(err.data.message) &&
                    (err.data.message.includes("The offers have updated.") ||
                        err.data.message === "execution reverted")
                ) {
                    setTokenOfferDetailDialogOpen(false);
                    cogoToast.info("Updating offers...", toastOptions);
                    getTokenOffers().then(() => {
                        cogoToast.success(
                            "Offers have been updated",
                            toastOptions
                        );
                    });
                }
            });
    };

    const getTokenOffers = async () => {
        const Contract = new web3.eth.Contract(
            OfferABI as AbiItem[],
            littleGhostsOfferContractAddress
        );
        const offerLength = await Contract.methods
            .viewTokenOffersLengthByCollectionAndId(collectionAddress, id)
            .call();

        const offers = await Contract.methods
            .viewTokenOffersByCollectionAndId(
                collectionAddress,
                id,
                0,
                offerLength
            )
            .call();

        setTokenOffers(offers[0]);
    };

    const getNftOffers = async () => {
        const Contract = new web3.eth.Contract(
            OfferABI as AbiItem[],
            littleGhostsOfferContractAddress
        );
        const offerLength = await Contract.methods
            .viewNftOffersLengthByCollectionAndId(collectionAddress, id)
            .call();

        const offers = await Contract.methods
            .viewNftOffersByCollectionAndId(
                collectionAddress,
                id,
                0,
                offerLength
            )
            .call();

        setNftOffers(offers[0]);
    };

    const createNftOffer = async (nftAddress, nftIds) => {
        await offerContract
            ?.createNFTOffer(collectionAddress, id, nftAddress, nftIds)
            .then((res, rej) => {
                setNftsOfferDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to create offer for #${id}`,
                    successMessage: `Offer is successfully created for #${id}.`,
                    res,
                    callback: async () => {
                        getNftOffers();
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    // Token offer dialog
    const [tokenOfferDialogOpen, setTokenOfferDialogOpen] = useState(false);
    const handleTokenOfferDialogClose = () => {
        setTokenOfferDialogOpen(false);
    };
    // Token Offer Detail dialog
    const [tokenOfferDetailDialogOpen, setTokenOfferDetailDialogOpen] =
        useState(false);
    const [selectedTokenOffer, setSelectedTokenOffer] =
        useState<TokenOffer | null>(null);
    const [selectedTokenOfferIndex, setSelectedTokenOfferIndex] = useState(0);
    const handleTokenOfferDetailDialogClose = () => {
        setTokenOfferDetailDialogOpen(false);
    };
    const handleViewTokenOffer = (offer: TokenOffer, index: number) => {
        setSelectedTokenOffer(offer);
        setSelectedTokenOfferIndex(index);
        setTokenOfferDetailDialogOpen(true);
    };

    // NFT Offer Detail dialog
    const [nftOfferDetailDialogOpen, setNftOfferDetailDialogOpen] =
        useState(false);
    const [selectedNftOffer, setSelectedNftOffer] = useState<NftOffer | null>(
        null
    );
    const [selectedNftOfferIndex, setSelectedNftOfferIndex] = useState(0);
    const handleNftOfferDetailDialogClose = () => {
        setNftOfferDetailDialogOpen(false);
    };
    const handleViewNftOffer = (offer: NftOffer, index: number) => {
        setSelectedNftOffer(offer);
        setSelectedNftOfferIndex(index);
        setNftOfferDetailDialogOpen(true);
    };

    /**
     * NFT Offer Dialog
     */
    const [nftsOfferDialogOpen, setNftsOfferDialogOpen] = useState(false);
    const handleNftsOfferDialogClose = () => {
        setNftsOfferDialogOpen(false);
    };

    /**
     * Minimum Offer Dialog
     */
    const [minimumOfferDialogOpen, setMinimumOfferDialogOpen] = useState(false);
    const handleMinimumOfferDialogClose = () => {
        setMinimumOfferDialogOpen(false);
    };
    // #endregion

    // #region (Auction)
    const [auctionDialogOpen, setAuctionDialogOpen] = useState(false);
    // Bidding
    const [biddingDialogOpen, setBiddingDialogOpen] = useState(false);
    const handleBiddingDialogClose = () => {
        setBiddingDialogOpen(false);
    };
    const handleAuctionDialogClose = () => {
        setAuctionDialogOpen(false);
    };

    // Buyout dialog
    const [buyoutDialogOpen, setBuyoutDialogOpen] = useState(false);
    const handleBuyoutDialogClose = () => {
        setBuyoutDialogOpen(false);
    };

    const getAuctionBidHistory = async (auction) => {
        const AuctionContract = new web3.eth.Contract(
            auctionABI as AbiItem[],
            littleGhostAuctionContractAddress
        );

        const bidCount = await AuctionContract.methods
            .getLength_AuctionBidHistory(auction.auctionID)
            .call();

        // TODO: probably need to use multicall
        const history = [] as Array<any>;
        for (let i = 0; i < bidCount; i++) {
            const amount = await AuctionContract.methods
                .auctionBidHistory(auction.auctionID, i)
                .call();
            history.push(amount);
        }
        return history;
    };

    const bid = async ({ bidAmount }) => {
        if (!item?.auction) {
            return;
        }
        await auctionContract
            ?.bid(
                item.auction.auctionID,
                solidityTokenFormat(
                    bidAmount,
                    getPaymentTokenDecimals(item.auction.paymentToken)
                ),
                {
                    value: 0,
                }
            )
            .then((res, rej) => {
                setBiddingDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to bid on #${id}`,
                    successMessage: `Successfully bid for #${id}.`,
                    res,
                    callback: async () => {
                        refreshItem();
                        getAuctionBidHistory(item.auction).then((history) => {
                            setBiddingHistory(history);
                        });
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const createAuction = async ({
        paymentToken,
        bidOnly,
        buyoutAmount,
        duration,
        startingBid,
    }) => {
        if (bidOnly) {
            buyoutAmount = 0;
        }
        await auctionContract
            ?.createAuction(
                paymentToken.tokenAddress,
                solidityTokenFormat(buyoutAmount, paymentToken.decimals),
                collectionAddress,
                duration,
                id,
                bidOnly,
                solidityTokenFormat(startingBid, paymentToken.decimals)
            )
            .then((res, rej) => {
                setAuctionDialogOpen(false);
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to create auction for #${id}`,
                    successMessage: `Auction is successfully created for #${id}.`,
                    res,
                    callback: async () => {
                        refreshItem();
                        setisItemOnAuction(true);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const cancelAuction = async () => {
        if (!item?.auction) {
            return;
        }
        //@ts-ignore
        await auctionContract
            .cancelAuction(item.auction.auctionID)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to cancel auction for #${id}`,
                    successMessage: `Auction for #${id} is successfully cancelled.`,
                    res,
                    callback: async () => {
                        setisItemOnAuction(false);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const finalizeAuction = async () => {
        if (!item?.auction) {
            return;
        }
        //@ts-ignore
        await auctionContract
            .finalizeAuction(item.auction.auctionID)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting to finalize auction for #${id}`,
                    successMessage: `Auction for #${id} is successfully finalized.`,
                    res,
                    callback: async () => {
                        setisItemOnAuction(false);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };

    const buyOut = useCallback(async () => {
        if (!item?.auction) {
            return;
        }
        //@ts-ignore
        await auctionContract
            .buyOut(item.auction.auctionID)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting for buyout the auction for #${id}`,
                    successMessage: `You have successfully bought #${id}`,
                    res,
                    callback: async () => {
                        setisItemOnAuction(false);
                        setUserOwnItem(true);
                        setOwnerAddress(account);
                    },
                });
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    }, [
        account,
        item,
        auctionContract,
        handleWeb3Reponse,
        handleWeb3Error,
        id,
    ]);

    const handleOnBuyoutClick = useCallback(() => {
        const _approved =
            item?.auction?.paymentToken.toLowerCase() === ectoContractAddress
                ? isEctoApprovedForAuction
                : item?.auction?.paymentToken.toLowerCase() === busdTokenAddress
                ? isBusdApprovedForAuction
                : item?.auction?.paymentToken.toLowerCase() === wbnbTokenAddress
                ? isWbnbApprovedForAuction
                : false;
        if (_approved) {
            buyOut();
        } else {
            setBuyoutDialogOpen(true);
        }
    }, [
        item,
        buyOut,
        setBuyoutDialogOpen,
        isEctoApprovedForAuction,
        isBusdApprovedForAuction,
        isWbnbApprovedForAuction,
    ]);

    // #endregion

    // #region (Update functions)
    const refreshItem = useCallback(async () => {
        if (collectionAddress && !isUndefined(id)) {
            fetchCollectionitem({
                blockchain: blockchains.BSC,
                collection: collectionAddress,
                id: +id,
            }).then(async (response) => {
                let _item = response.data;
                if (_item.address === lootboxContractAddress) {
                    await getLootbox(_item.id).then((_lootbox) => {
                        _item = { ..._item, ..._lootbox };
                        LootboxUtilModel.loadSingleLootboxMetadata(
                            _item as LootboxSingleItem
                        );
                    });
                }
                setItem(_item);
            });
        }
    }, [collectionAddress, id]);

    // #endregion

    // #region (Lootbox)
    const openLootbox = useOpenLootbox();
    const claimLootboxRewards = useClaimLootboxReward();
    const [isSpinBoxOpen, setIsSpinBoxOpen] = useState(false);
    const [isLootboxApprovedToClaim, setIsLootboxApprovedToClaim] =
        useState(false);
    const approveLootboxForClaim = useApproveClaimLootboxReward();
    const handleOpenFounderLootbox = useCallback(() => {
        if (!item) {
            return;
        }
        updateOverlay(true);
        openLootbox({
            lootboxes: [item.token_id],
            callback: (receipt) => {
                setIsSpinBoxOpen(true);
                updateOverlay(false);
                setItem({
                    ...item,
                    status: LootboxUtilModel.LOOTBOX_STATUSES.OPENING,
                });
            },
            errorCallback: () => {
                updateOverlay(false);
            },
        });
    }, [item, openLootbox, updateOverlay]);
    const handleClaimFounderLootbox = useCallback(() => {
        if (!item) {
            return;
        }
        claimLootboxRewards({
            lootboxes: [item.token_id],
            callback: (receipt) => {
                refreshItem();
                setUserOwnItem(false);
                setIsSpinBoxOpen(false);
            },
        });
    }, [item, claimLootboxRewards, refreshItem]);

    const handleApproveFounderLootbox = useCallback(() => {
        if (!item) {
            return;
        }
        if (!isLootboxApprovedToClaim) {
            approveLootboxForClaim({
                callback: () => {
                    setIsLootboxApprovedToClaim(true);
                },
            });
            return;
        }
    }, [item, isLootboxApprovedToClaim, approveLootboxForClaim]);

    const handleCloseFounderLootbox = useCallback(() => {
        setIsSpinBoxOpen(false);
    }, []);
    // #endregion

    // #region (Gift)
    const [giftNftDialogOpen, setGiftNftDialogOpen] = useState(false);
    const handleGiftNftDialogClose = () => {
        setGiftNftDialogOpen(false);
    };
    const sendNFT = async (receiver: string) => {
        if (!item) {
            return;
        }
        const address = isAddress(receiver);
        if (!address) {
            cogoToast.error("Invalid address", toastOptions);
            return;
        }
        // eslint-disable-next-line react-hooks/rules-of-hooks
        CollectionContract?.transferFrom(account, receiver, item?.id)
            .then((res) => {
                handleWeb3Reponse({
                    waitingMessage: `Waiting for confirmations to send #${item.id} to ${address}`,
                    successMessage: `#${item.id} successfully sent to ${address}`,
                    res,
                    callback: () => {
                        setOwnerAddress(receiver);
                    },
                });
                handleGiftNftDialogClose();
            })
            .catch((err) => {
                handleWeb3Error({ err });
            });
    };
    // #endregion

    useEffect(() => {
        let mounted = true;
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 60000); // a minute
        if (collectionAddress && !isUndefined(id)) {
            fetchCollectionitem({
                blockchain: blockchains.BSC,
                collection: collectionAddress,
                id: +id,
            }).then(async (response) => {
                if (mounted) {
                    let _item = response.data;
                    if (_item.address === lootboxContractAddress) {
                        await getLootbox(_item.id).then((_lootbox) => {
                            _item = { ..._item, ..._lootbox };
                            LootboxUtilModel.loadSingleLootboxMetadata(
                                _item as LootboxSingleItem
                            );
                        });
                    }
                    setItem(_item);
                    setIsItemListed(!!_item.price);
                    setisItemOnAuction(!!_item.auction);
                    setListedPrice(_item.price || "");
                    if (_item.price && _item.seller) {
                        setOwnerAddress(_item.seller);
                    } else if (_item.auction && _item.auction.createdBy) {
                        setOwnerAddress(_item.auction.createdBy);
                        getAuctionBidHistory(_item.auction).then((history) => {
                            setBiddingHistory(history);
                        });
                    } else {
                        getOwnerOfToken(collectionAddress, +id).then(
                            (_owner) => {
                                setOwnerAddress(_owner);
                            }
                        );
                    }
                    getTokenOffers();
                    getNftOffers();
                }
            });
        }
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [collectionAddress, id]);

    useEffect(() => {
        if (chainId !== blockchains.BSC) {
            enqueueSnackbar(
                "Switch to BNB chain to enable page marketplace features.",
                { variant: "warning", preventDuplicate: true }
            );
            return;
        }
        checkIfMarketplaceContractIsApproved();
        checkIfPancakeSwapMarketplaceContractIsApproved();
        checkIfAuctionContractIsApproved();
        checkIfOfferContractIsApproved();
        checkIfWbnbIsApprovedForAuction();
        checkIfEctoIsApprovedForAuction();
        checkIfBusdIsApprovedForAuction();
        checkIfLootboxIsApprovedForClaim();
        setUserOwnItem(ownerAddress === account);
    }, [account, ownerAddress, chainId]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(ownerAddress || "");
            enqueueSnackbar("Copied.", {
                variant: "info",
                preventDuplicate: true,
                autoHideDuration: 1500,
            });
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const BuyoutDisplay = useMemo(() => {
        if (!item?.auction) {
            return <></>;
        }
        const paymentTokenDecimals = getPaymentTokenDecimals(
            item.auction.paymentToken
        );
        if (item.auction.bidOnly) {
            return (
                <Loading loading={!ready}>
                    <div className="BuyoutDisplay">
                        {t("BuyoutDisplay.buyout", { defaultValue: "Buyout" })}:
                        N/A
                    </div>
                </Loading>
            );
        }
        return (
            <Loading loading={!ready}>
                <div className="BuyoutDisplay">
                    {t("BuyoutDisplay.buyout", { defaultValue: "Buyout" })}:{" "}
                    {(+fromSolidityTokenFormat(
                        item.auction.price,
                        paymentTokenDecimals
                    )).toLocaleString()}{" "}
                    <span>
                        {getPaymentTokenDisplay(item.auction.paymentToken)}
                    </span>
                    <span>
                        &nbsp;($
                        {(+getBuyoutPriceInUsd(
                            item.auction,
                            ectoPrice,
                            bnbPrice
                        )).toFixed()}
                        )
                    </span>
                </div>
            </Loading>
        );
    }, [item, t, bnbPrice, ectoPrice, ready]);

    return (
        <div id="CollectionItem" className="scrollbar">
            {item ? (
                <div className="content container py-5">
                    {chainId === blockchains.BSC && (
                        <div className="actions">
                            <BuyButton
                                account={account || ""}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                buyItem={buyItem}
                            />
                            <SetMinimumOfferButton
                                account={account || ""}
                                isItemListed={isItemListed}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                setMinimumOfferDialogOpen={
                                    setMinimumOfferDialogOpen
                                }
                            />
                            <OfferButton
                                account={account || ""}
                                item={item}
                                userOwnItem={userOwnItem}
                                handleOfferClick={handleOfferClick}
                                offerAnchorEl={offerAnchorEl}
                                handleOfferMenuClose={handleOfferMenuClose}
                            />
                            <SellButton
                                account={account || ""}
                                isItemListed={isItemListed}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                handleListingClick={handleListingClick}
                                listingAnchorEl={listingAnchorEl}
                                handleListingMenuClose={handleListingMenuClose}
                            />
                            <GiftButton
                                account={account || ""}
                                isItemOnAuction={isItemOnAuction}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                setGiftNftDialogOpen={setGiftNftDialogOpen}
                            />
                            <CancelSellingButton
                                account={account || ""}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                unlistItemFromMarketplace={
                                    unlistItemFromMarketplace
                                }
                            />
                            <CancelAuctionButton
                                account={account || ""}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                cancelAuction={cancelAuction}
                                item={item}
                            />
                            <FinalizeAuctionButton
                                account={account || ""}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                item={item}
                                finalizeAuction={finalizeAuction}
                            />
                            <BidButton
                                account={account || ""}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                setBiddingDialogOpen={setBiddingDialogOpen}
                            />
                            <BuyoutButton
                                account={account || ""}
                                isItemOnAuction={isItemOnAuction}
                                userOwnItem={userOwnItem}
                                item={item}
                                handleOnBuyoutClick={handleOnBuyoutClick}
                            />
                            <OpenFounderLootboxButton
                                item={item as LootboxSingleItem}
                                account={account || ""}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                isItemOnAuction={isItemOnAuction}
                                handleOpenFounderLootbox={
                                    handleOpenFounderLootbox
                                }
                            />

                            <ClaimFounderLootboxButton
                                item={item as LootboxSingleItem}
                                account={account || ""}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                isItemOnAuction={isItemOnAuction}
                                handleClaimFounderLootbox={
                                    handleClaimFounderLootbox
                                }
                                isApproved={isLootboxApprovedToClaim}
                            />

                            <ApproveFounderLootboxButton
                                item={item as LootboxSingleItem}
                                account={account || ""}
                                isItemListed={isItemListed}
                                userOwnItem={userOwnItem}
                                isItemOnAuction={isItemOnAuction}
                                handleApproveFounderLootbox={
                                    handleApproveFounderLootbox
                                }
                                isApproved={isLootboxApprovedToClaim}
                            />

                            <LikeButton />
                        </div>
                    )}
                    <div className="row nft-info-container">
                        <div className="nft-image col-12 col-md-12 col-lg-4 col-sm-12">
                            <div>
                                <ImageTag
                                    src={collectionItemImageUrl({
                                        item,
                                        view3d,
                                    })}
                                />
                            </div>
                        </div>
                        <div className="nft-info-grid-wrapper col-12 col-md-12 col-lg-8 col-sm-12">
                            <div className="nft-info-grid">
                                <div
                                    className={`nft-info ${
                                        !isItemOnAuction && !isItemListed
                                            ? "unlisted"
                                            : ""
                                    }`}
                                >
                                    <div className="nft-info-wrapper">
                                        <div className="id-and-rank">
                                            <div className="id-and-icon">
                                                <div className="id">
                                                    ID: #
                                                    <span
                                                        className={
                                                            showIdSearch
                                                                ? "hide"
                                                                : ""
                                                        }
                                                    >
                                                        {id}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`id-search-input-wrapper ${
                                                        showIdSearch
                                                            ? ""
                                                            : "hide"
                                                    }`}
                                                >
                                                    <form
                                                        onSubmit={
                                                            handleOnSearchIdSubmit
                                                        }
                                                    >
                                                        <Input
                                                            value={searchId}
                                                            className="id-search-input"
                                                            type="search"
                                                            pattern="\d*"
                                                            onChange={
                                                                handleOnSearchIdChange
                                                            }
                                                        />
                                                    </form>
                                                </div>
                                                <div className="search-icon">
                                                    <IconButton
                                                        onClick={
                                                            handleOnSearchIconClick
                                                        }
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </div>
                                            </div>

                                            <div>
                                                {!!item.rankable && (
                                                    <Loading loading={!ready}>
                                                        {t("rank")}:{" "}
                                                        {item.rank || "?"} /{" "}
                                                        {item.collection_total ||
                                                            "?"}
                                                    </Loading>
                                                )}
                                            </div>
                                            <div>
                                                {(item as LootboxSingleItem)
                                                    .status && (
                                                    <Loading loading={!ready}>
                                                        Status:{" "}
                                                        {
                                                            (
                                                                item as LootboxSingleItem
                                                            ).status
                                                        }
                                                    </Loading>
                                                )}
                                            </div>
                                        </div>
                                        <div className="listing-or-auction-info">
                                            {isItemListed && (
                                                <ItemListedPriceDetail
                                                    listedPrice={listedPrice}
                                                    userOwnItem={userOwnItem}
                                                    setFixedListingDialogOpen={
                                                        setFixedListingDialogOpen
                                                    }
                                                />
                                            )}
                                            {isItemOnAuction && (
                                                <ItemAuctionPriceDetail
                                                    BuyoutDisplay={
                                                        BuyoutDisplay
                                                    }
                                                    item={item}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="owner-and-marketplace">
                                        <div className="owner">
                                            <div className="owner-heading">
                                                <Loading loading={!ready}>
                                                    {t("owner", {
                                                        defaultValue: "Owner",
                                                    })}
                                                    :
                                                </Loading>
                                                <ContentCopyIcon
                                                    onClick={copyToClipboard}
                                                    className="copy-btn"
                                                />
                                            </div>

                                            <InternalLink
                                                to={`/wallet/${ownerAddress}`}
                                            >
                                                <span>
                                                    {ownerAddress?.substring(
                                                        0,
                                                        10
                                                    ) + "..."}
                                                </span>
                                            </InternalLink>
                                            <div>
                                                <ExternalLink
                                                    href={`https://bscscan.com/address/${ownerAddress}`}
                                                >
                                                    <OutlinedButton size="small">
                                                        BscScan
                                                    </OutlinedButton>
                                                </ExternalLink>
                                            </div>
                                        </div>
                                        {(isItemOnAuction ||
                                            item.marketplace) && (
                                            <div>
                                                <MarketplaceLogoInternalLink
                                                    marketplaceType={
                                                        isItemOnAuction
                                                            ? MarketplaceUtilModel
                                                                  .MARKETPLACE_TYPES
                                                                  .LG_MARKETPLACE
                                                            : item.marketplace ||
                                                              MarketplaceUtilModel
                                                                  .MARKETPLACE_TYPES
                                                                  .LG_MARKETPLACE
                                                    }
                                                    nftUri={RouteUtilModel.getCategoryRoute(
                                                        {
                                                            collectionAddress:
                                                                item.address.toLowerCase(),
                                                            tokenID:
                                                                +item.token_id,
                                                        }
                                                    )}
                                                    size="35px"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row attributes-bidding-offer-container">
                        <div className="ItemAttributes-grid col-12 col-md-12 col-lg-4 col-sm-12">
                            <ItemAttributes item={item} />
                        </div>
                        <div className="ItemBiddings-Offers-grid col-12 col-md-12 col-lg-8 col-sm-12">
                            <div className="offers-wrapper">
                                {isItemOnAuction && item.auction && (
                                    <ItemBiddings
                                        auction={item.auction}
                                        currentTime={currentTime}
                                        biddingHistory={biddingHistory}
                                    />
                                )}

                                <div className="offers scrollbar scrollable">
                                    <Tabs
                                        value={offerTab}
                                        onChange={handleOfferTabChange}
                                        variant="fullWidth"
                                        className="OfferTab"
                                    >
                                        <Tab
                                            label={
                                                <Loading loading={!ready}>
                                                    {t("token_offers", {
                                                        defaultValue:
                                                            "Token Offers",
                                                    })}{" "}
                                                    ({tokenOffers.length})
                                                </Loading>
                                            }
                                        />
                                        <Tab
                                            label={
                                                <Loading loading={!ready}>
                                                    {t("nft_offers", {
                                                        defaultValue:
                                                            "NFT Offers",
                                                    })}{" "}
                                                    ({nftOffers.length})
                                                </Loading>
                                            }
                                        />
                                    </Tabs>

                                    <div className="text-center pt-5">
                                        {offerTab === OFFER_TABS.TOKEN ? (
                                            <TokenOffers
                                                tokenOffers={tokenOffers}
                                                handleViewTokenOffer={
                                                    handleViewTokenOffer
                                                }
                                            />
                                        ) : (
                                            <NftOffers
                                                nftOffers={nftOffers}
                                                handleViewNftOffer={
                                                    handleViewNftOffer
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ListItemDialog
                        open={fixedListingDialogOpen}
                        imageLink={collectionItemImageUrl({
                            item,
                            view3d,
                        })}
                        onClose={handleFixedListingDialogClose}
                        onList={listOrModifyPrice}
                        approved={
                            marketplaceToList ===
                            LISTING_MENU_ITEMS.LG_MARKETPLACE
                                ? isLittleGhostMarketplaceContractApproved
                                : isPancakeSwapMarketplaceContractApproved
                        }
                        onApprove={
                            marketplaceToList ===
                            LISTING_MENU_ITEMS.LG_MARKETPLACE
                                ? approveMarketplaceContract
                                : approvePancakeMarketplaceContract
                        }
                    />
                    {nftsOfferDialogOpen && (
                        <NftsOfferDialog
                            open={nftsOfferDialogOpen}
                            handleClose={handleNftsOfferDialogClose}
                            handleOnOffer={createNftOffer}
                        />
                    )}
                    <AuctionDialog
                        open={auctionDialogOpen}
                        imageLink={collectionItemImageUrl({
                            item,
                            view3d,
                        })}
                        onClose={handleAuctionDialogClose}
                        onCreateAuction={createAuction}
                        approved={isLittleGhostAuctionContractApproved}
                        onApprove={approveAuctionContract}
                    />
                    {item.auction && (
                        <BiddingDialog
                            open={biddingDialogOpen}
                            imageLink={collectionItemImageUrl({
                                item,
                                view3d,
                            })}
                            onClose={handleBiddingDialogClose}
                            onBidding={bid}
                            paymentToken={item.auction?.paymentToken}
                            approved={
                                item?.auction?.paymentToken.toLowerCase() ===
                                ectoContractAddress
                                    ? isEctoApprovedForAuction
                                    : item?.auction?.paymentToken.toLowerCase() ===
                                      busdTokenAddress
                                    ? isBusdApprovedForAuction
                                    : item?.auction?.paymentToken.toLowerCase() ===
                                      wbnbTokenAddress
                                    ? isWbnbApprovedForAuction
                                    : false
                            }
                            onApprove={
                                item?.auction?.paymentToken.toLowerCase() ===
                                ectoContractAddress
                                    ? approveEctoForAuctionContract
                                    : item?.auction?.paymentToken.toLowerCase() ===
                                      busdTokenAddress
                                    ? approveBusdForAuctionContract
                                    : item?.auction?.paymentToken.toLowerCase() ===
                                      wbnbTokenAddress
                                    ? approveWbnbForAuctionContract
                                    : () => {}
                            }
                        />
                    )}
                    <BuyoutDialog
                        open={buyoutDialogOpen}
                        imageLink={collectionItemImageUrl({
                            item,
                            view3d,
                        })}
                        onClose={handleBuyoutDialogClose}
                        onBuyout={buyOut}
                        approved={
                            item?.auction?.paymentToken.toLowerCase() ===
                            ectoContractAddress
                                ? isEctoApprovedForAuction
                                : item?.auction?.paymentToken.toLowerCase() ===
                                  busdTokenAddress
                                ? isBusdApprovedForAuction
                                : item?.auction?.paymentToken.toLowerCase() ===
                                  wbnbTokenAddress
                                ? isWbnbApprovedForAuction
                                : false
                        }
                        onApprove={
                            item?.auction?.paymentToken.toLowerCase() ===
                            ectoContractAddress
                                ? approveEctoForAuctionContract
                                : item?.auction?.paymentToken.toLowerCase() ===
                                  busdTokenAddress
                                ? approveBusdForAuctionContract
                                : item?.auction?.paymentToken.toLowerCase() ===
                                  wbnbTokenAddress
                                ? approveWbnbForAuctionContract
                                : () => {}
                        }
                    />
                    <TokenOfferDialog
                        open={tokenOfferDialogOpen}
                        imageLink={collectionItemImageUrl({ view3d, item })}
                        onClose={handleTokenOfferDialogClose}
                        onCreateOffer={createTokenOffer}
                        item={item}
                    />
                    <MinimumOfferDialog
                        open={minimumOfferDialogOpen}
                        imageLink={collectionItemImageUrl({ view3d, item })}
                        onClose={handleMinimumOfferDialogClose}
                        item={item}
                    />
                    {selectedTokenOffer && ownerAddress && (
                        <TokenOfferDetailDialog
                            open={tokenOfferDetailDialogOpen}
                            imageLink={collectionItemImageUrl({ view3d, item })}
                            onClose={handleTokenOfferDetailDialogClose}
                            onAcceptOffer={accpetTokenOffer}
                            onCancelOffer={cancelTokenOffer}
                            onRejectOffer={rejectTokenOffer}
                            approved={isLittleGhostOfferContractApproved}
                            onApprove={approveOfferContract}
                            offer={selectedTokenOffer}
                            ownerAddress={ownerAddress}
                        />
                    )}
                    {selectedNftOffer && ownerAddress && (
                        <NftsOfferDetailDialog
                            open={nftOfferDetailDialogOpen}
                            onClose={handleNftOfferDetailDialogClose}
                            onAcceptOffer={accpetNftOffer}
                            onCancelOffer={cancelNftOffer}
                            onRejectOffer={rejectNftOffer}
                            approved={isLittleGhostOfferContractApproved}
                            onApprove={approveOfferContract}
                            offer={selectedNftOffer}
                            ownerAddress={ownerAddress}
                        />
                    )}
                    <SendNftDialog
                        open={giftNftDialogOpen}
                        imageLink={collectionItemImageUrl({ view3d, item })}
                        onClose={handleGiftNftDialogClose}
                        onSend={sendNFT}
                    />
                    {isSpinBoxOpen && (
                        <RewardSpinDialog
                            open={isSpinBoxOpen}
                            onClose={handleCloseFounderLootbox}
                            itemID={item.token_id}
                            onClaim={handleClaimFounderLootbox}
                            isApproved={isLootboxApprovedToClaim}
                            onApprove={handleApproveFounderLootbox}
                        />
                    )}
                </div>
            ) : (
                <Loader show={!item} />
            )}
            <QuickSetting />
        </div>
    );
};

const BuyButton = ({
    account,
    isItemListed,
    userOwnItem,
    buyItem,
}: {
    account;
    isItemListed: boolean;
    userOwnItem: boolean;
    buyItem: () => Promise<void>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && isItemListed && !userOwnItem ? (
        <OutlinedButton className="action-button" onClick={() => buyItem()}>
            <ShoppingBagIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("buy", { defaultValue: "Buy" })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const SetMinimumOfferButton = ({
    account,
    isItemListed,
    isItemOnAuction,
    userOwnItem,
    setMinimumOfferDialogOpen,
}: {
    account: string;
    isItemListed: boolean;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    setMinimumOfferDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && !isItemListed && !isItemOnAuction && userOwnItem ? (
        <OutlinedButton
            className="action-button"
            onClick={() => {
                setMinimumOfferDialogOpen(true);
            }}
        >
            <EditIcon fontSize="large" />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("minimum_offer", { defaultValue: "Minimum Offer" })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const OfferButton = ({
    item,
    account,
    userOwnItem,
    handleOfferClick,
    offerAnchorEl,
    handleOfferMenuClose,
}: {
    item: SingleCollectionItem | LootboxSingleItem;
    account: string;
    userOwnItem: boolean;
    handleOfferClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    offerAnchorEl: (EventTarget & HTMLButtonElement) | null;
    handleOfferMenuClose: (menuItem: number) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });

    if ((item as LootboxSingleItem).claimed) {
        return <></>;
    }

    return !isUndefined(item.id) && account && !userOwnItem ? (
        <>
            <OutlinedButton
                className="action-button"
                onClick={handleOfferClick}
            >
                <LocalOfferIcon />
                <span className="ms-2">
                    <Loading loading={!ready}>
                        {t("ActionButtons.offer", { defaultValue: "Offer" })}
                    </Loading>
                </span>
            </OutlinedButton>
            <Menu
                anchorEl={offerAnchorEl}
                keepMounted
                open={Boolean(offerAnchorEl)}
                onClose={handleOfferMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleOfferMenuClose(OFFER_MENU_ITEMS.TOKENS);
                    }}
                >
                    <Loading loading={!ready}>
                        {t("offerDropdown.selections.tokens", {
                            defaultValue: "Tokens",
                        })}
                    </Loading>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        handleOfferMenuClose(OFFER_MENU_ITEMS.NFT);
                    }}
                >
                    NFTs
                </MenuItem>
            </Menu>
        </>
    ) : (
        <></>
    );
};

const SellButton = ({
    account,
    isItemListed,
    isItemOnAuction,
    userOwnItem,
    handleListingClick,
    listingAnchorEl,
    handleListingMenuClose,
}: {
    account: string;
    isItemListed: boolean;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    handleListingClick: (event: any) => void;
    listingAnchorEl: (EventTarget & HTMLButtonElement) | null;
    handleListingMenuClose: (menuItem: number) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });

    return account && !isItemListed && !isItemOnAuction && userOwnItem ? (
        <>
            <OutlinedButton
                onClick={handleListingClick}
                className="action-button"
            >
                <StorefrontRoundedIcon />
                <span className="ms-2">
                    <Loading loading={!ready}>
                        {t("ActionButtons.sell", { defaultValue: "Sell" })}
                    </Loading>
                </span>
            </OutlinedButton>
            <Menu
                id="listing-menu"
                anchorEl={listingAnchorEl}
                keepMounted
                open={Boolean(listingAnchorEl)}
                onClose={handleListingMenuClose}
            >
                <MenuItem
                    onClick={() => {
                        handleListingMenuClose(
                            LISTING_MENU_ITEMS.LG_MARKETPLACE
                        );
                    }}
                >
                    <Loading loading={!ready}>
                        {t("sellDropdown.selections.lg", {
                            defaultValue: "LittleGhosts Marketplace",
                        })}
                    </Loading>
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => {
                        handleListingMenuClose(
                            LISTING_MENU_ITEMS.PANCAKE_MARKETPLACE
                        );
                    }}
                >
                    <Loading loading={!ready}>
                        {t("sellDropdown.selections.pcs", {
                            defaultValue: "Pancakeswap",
                        })}
                    </Loading>
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={() => {
                        handleListingMenuClose(LISTING_MENU_ITEMS.AUCTION);
                    }}
                >
                    <Loading loading={!ready}>
                        {t("sellDropdown.selections.auction", {
                            defaultValue: "Auction",
                        })}
                    </Loading>
                </MenuItem>
            </Menu>
        </>
    ) : (
        <></>
    );
};

const CancelSellingButton = ({
    account,
    isItemListed,
    userOwnItem,
    unlistItemFromMarketplace,
}: {
    account: string;
    isItemListed: boolean;
    userOwnItem: boolean;
    unlistItemFromMarketplace: () => Promise<void>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && isItemListed && userOwnItem ? (
        <OutlinedButton
            className="action-button"
            onClick={() => {
                unlistItemFromMarketplace();
            }}
        >
            <BackspaceIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("cancel_selling", {
                        defaultValue: "Cancel Selling",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const GiftButton = ({
    account,
    isItemOnAuction,
    isItemListed,
    userOwnItem,
    setGiftNftDialogOpen,
}: {
    account: string;
    isItemOnAuction: boolean;
    isItemListed: boolean;
    userOwnItem: boolean;
    setGiftNftDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && !isItemListed && !isItemOnAuction && userOwnItem ? (
        <OutlinedButton
            className="action-button"
            onClick={() => {
                setGiftNftDialogOpen(true);
            }}
        >
            <CardGiftcardIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("gift", {
                        defaultValue: "Gift",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const CancelAuctionButton = ({
    account,
    isItemOnAuction,
    userOwnItem,
    cancelAuction,
    item,
}: {
    account: string;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    cancelAuction: () => Promise<void>;
    item: SingleCollectionItem;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account &&
        isItemOnAuction &&
        userOwnItem &&
        !isAuctionExpired(item.auction) ? (
        <OutlinedButton
            className="action-button"
            onClick={() => {
                cancelAuction();
            }}
        >
            <BackspaceIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("cancel_auction", {
                        defaultValue: "Cancel Auction",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const FinalizeAuctionButton = ({
    account,
    isItemOnAuction,
    userOwnItem,
    item,
    finalizeAuction,
}: {
    account: string;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    item: SingleCollectionItem;
    finalizeAuction: () => Promise<void>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && isItemOnAuction && isAuctionExpired(item.auction) ? (
        <OutlinedButton
            onClick={() => {
                finalizeAuction();
            }}
            className="action-button"
        >
            <GavelIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("finalize_auction", {
                        defaultValue: "Finalize Auction",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const BidButton = ({
    account,
    isItemOnAuction,
    userOwnItem,
    setBiddingDialogOpen,
}: {
    account: string;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    setBiddingDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account && isItemOnAuction && !userOwnItem ? (
        <OutlinedButton
            className="action-button"
            onClick={() => {
                setBiddingDialogOpen(true);
            }}
        >
            <AttachMoneyIcon />
            <span className="ms-1">
                <Loading loading={!ready}>
                    {t("bid", {
                        defaultValue: "Bid",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const BuyoutButton = ({
    account,
    isItemOnAuction,
    userOwnItem,
    item,
    handleOnBuyoutClick,
}: {
    account: string;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    item: SingleCollectionItem;
    handleOnBuyoutClick: () => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ActionButtons",
    });

    return account &&
        isItemOnAuction &&
        !userOwnItem &&
        !item.auction?.bidOnly &&
        !isAuctionExpired(item?.auction) ? (
        <OutlinedButton
            onClick={() => {
                handleOnBuyoutClick();
            }}
            className="action-button"
        >
            <ShoppingBagIcon />
            <span className="ms-2">
                <Loading loading={!ready}>
                    {t("buyout", {
                        defaultValue: "Buyout",
                    })}
                </Loading>
            </span>
        </OutlinedButton>
    ) : (
        <></>
    );
};

const LikeButton = () => {
    const { asset, id } = useParams();
    const user = useUser();
    const [liked, setLiked] = useState(false);
    const [fetched, setFetched] = useState(false);
    const recaptchaRef = useRef<any>();
    const { enqueueSnackbar } = useSnackbar();
    const updateOverlay = useUpdateOverlay();
    const [modelItem, setModelItem] = useState<null | AccountFavoredNftModel>();

    const like = useCallback(async () => {
        if (!user || !asset || !id) {
            return;
        }
        const recaptcha = RECAPTCHA_ENABLED ? await recaptchaRef.current.executeAsync() : '';
        if (RECAPTCHA_ENABLED) recaptchaRef.current.reset();

        const _modelItem = new AccountFavoredNftModel({
            nft_collection_id: NftCollectionModel.getCollectionIdByAsset({
                asset,
            }),
            nft_token_id: +id,
        });

        updateOverlay(true);
        _modelItem
            .save({
                recaptcha,
                recaptchaType: recaptchaTypes.V2_INVISIBLE,
            })
            .then((res) => {
                enqueueSnackbar("Added to favorites!", {
                    variant: "success",
                });
                setLiked(true);
                updateOverlay(false);
                setModelItem(_modelItem);
            })
            .catch((err) => {
                console.log(err);
                enqueueSnackbar("Failed to remove from favorites!", {
                    variant: "error",
                });
                updateOverlay(false);
            });
    }, [user, asset, id, recaptchaRef, updateOverlay, enqueueSnackbar]);

    const unlike = useCallback(async () => {
        if (!user || !asset || !id || !modelItem) {
            return;
        }
        const recaptcha = RECAPTCHA_ENABLED ? await recaptchaRef.current.executeAsync() : '';
        if (RECAPTCHA_ENABLED) recaptchaRef.current.reset();

        updateOverlay(true);
        modelItem
            .delete({
                recaptcha,
                recaptchaType: recaptchaTypes.V2_INVISIBLE,
            })
            .then((res) => {
                enqueueSnackbar("Removed from favorites!", {
                    variant: "success",
                });
                setLiked(false);
                updateOverlay(false);
                setModelItem(null);
            })
            .catch((err) => {
                console.log(err);
                enqueueSnackbar("Failed to remove from favorites!", {
                    variant: "error",
                });
                updateOverlay(false);
            });
    }, [
        user,
        asset,
        id,
        recaptchaRef,
        modelItem,
        updateOverlay,
        enqueueSnackbar,
    ]);

    const handleHeartOnClick = useCallback(async () => {
        if (liked) {
            unlike();
            return;
        }
        like();
    }, [liked, like, unlike]);

    useEffect(() => {
        if (!user || !asset || !id) {
            setFetched(false);
            return () => {};
        }
        let mounted = true;
        AccountFavoredNftModel.find({
            nft_collection_id: NftCollectionModel.getCollectionIdByAsset({
                asset,
            }),
            nft_token_id: id,
        }).then((res) => {
            if (mounted) {
                setFetched(true);
                setModelItem(res);
            }
        });
        return () => {
            mounted = false;
        };
    }, [user, asset, id]);

    useEffect(() => {
        setLiked(!!modelItem);
    }, [modelItem]);

    return asset && id && user && fetched ? (
        <>
            <IconButton
                onClick={() => {
                    handleHeartOnClick();
                }}
            >
                {liked ? (
                    <FavoriteIcon fontSize="large" />
                ) : (
                    <FavoriteBorderIcon fontSize="large" />
                )}
            </IconButton>
            {RECAPTCHA_ENABLED && (
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={RECAPTCHA_INVISIBLE_SITE_KEY}
                />
            )}
        </>
    ) : (
        <></>
    );
};

const OpenFounderLootboxButton = ({
    item,
    account,
    isItemListed,
    isItemOnAuction,
    userOwnItem,
    handleOpenFounderLootbox,
}: {
    item: LootboxSingleItem;
    account: string;
    isItemListed: boolean;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    handleOpenFounderLootbox: (event: any) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });

    return account &&
        !isItemListed &&
        !isItemOnAuction &&
        userOwnItem &&
        item.status === LootboxUtilModel.LOOTBOX_STATUSES.UNOPENED ? (
        <>
            <OutlinedButton
                onClick={handleOpenFounderLootbox}
                className="action-button"
            >
                <LockOpenIcon />
                <span className="ms-2">
                    <Loading loading={!ready}>
                        {t("ActionButtons.open_lootbox", {
                            defaultValue: "Open Lootbox",
                        })}
                    </Loading>
                </span>
            </OutlinedButton>
        </>
    ) : (
        <></>
    );
};

const ClaimFounderLootboxButton = ({
    item,
    account,
    isItemListed,
    isItemOnAuction,
    userOwnItem,
    handleClaimFounderLootbox,
    isApproved,
}: {
    item: LootboxSingleItem;
    account: string;
    isItemListed: boolean;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    handleClaimFounderLootbox: (event: any) => void;
    isApproved: boolean;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });

    return account &&
        isApproved &&
        !isItemListed &&
        !isItemOnAuction &&
        userOwnItem &&
        item.status === LootboxUtilModel.LOOTBOX_STATUSES.OPENED ? (
        <>
            <OutlinedButton
                onClick={handleClaimFounderLootbox}
                className="action-button"
            >
                <LockOpenIcon />
                <span className="ms-2">
                    <Loading loading={!ready}>
                        {t("ActionButtons.claim_loot", {
                            defaultValue: "Claim Loots",
                        })}
                    </Loading>
                </span>
            </OutlinedButton>
        </>
    ) : (
        <></>
    );
};

const ApproveFounderLootboxButton = ({
    item,
    account,
    isItemListed,
    isItemOnAuction,
    userOwnItem,
    handleApproveFounderLootbox,
    isApproved,
}: {
    item: LootboxSingleItem;
    account: string;
    isItemListed: boolean;
    isItemOnAuction: boolean;
    userOwnItem: boolean;
    handleApproveFounderLootbox: (event: any) => void;
    isApproved: boolean;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails",
    });

    return !isApproved &&
        account &&
        !isItemListed &&
        !isItemOnAuction &&
        userOwnItem &&
        item.status === LootboxUtilModel.LOOTBOX_STATUSES.OPENED ? (
        <>
            <OutlinedButton
                onClick={handleApproveFounderLootbox}
                className="action-button"
            >
                <LockOutlinedIcon />
                <span className="ms-2">
                    <Loading loading={!ready}>
                        {t("ActionButtons.approve_claim_loot", {
                            defaultValue: "Approve Claim Loots",
                        })}
                    </Loading>
                </span>
            </OutlinedButton>
        </>
    ) : (
        <></>
    );
};

const ItemListedPriceDetail = ({
    listedPrice,
    userOwnItem,
    setFixedListingDialogOpen,
}: {
    listedPrice: string;
    userOwnItem: boolean;
    setFixedListingDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ItemListedPriceDetail",
    });

    const bnbPrice = useBnbPriceInUsd();
    const listPrice = useMemo(() => {
        return weiToBnb({ wei: listedPrice, precision: 3 });
    }, [listedPrice]);
    const listPriceInUsd = useMemo(() => {
        return getTokenPriceInUsd({
            address: wbnbTokenAddress,
            amount: listPrice,
            bnbPrice,
            solidityFormat: false,
        });
    }, [listPrice, bnbPrice]);

    return (
        <div className="ItemListedPriceDetail">
            <div className="price">
                <span className="bnb-price">BNB: {listPrice}</span>
                <span className="usd">${listPriceInUsd}</span>
            </div>
            {userOwnItem && (
                <OutlinedButton
                    onClick={() => {
                        setFixedListingDialogOpen(true);
                    }}
                    className="action-button"
                >
                    <EditIcon />
                    <span className="ms-2">
                        <Loading loading={!ready}>
                            {t("edit_price", {
                                defaultValue: "Edit Price",
                            })}
                        </Loading>
                    </span>
                </OutlinedButton>
            )}
        </div>
    );
};

const ItemAuctionPriceDetail = ({
    BuyoutDisplay,
    item,
}: {
    BuyoutDisplay: JSX.Element;
    item: SingleCollectionItem;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ItemAuctionPriceDetail",
    });

    const ectoPrice = useEctoPriceInUsd();
    const bnbPrice = useBnbPriceInUsd();
    const currentBidPriceInusd = useMemo(() => {
        return (+getCurrentBiddingPriceInUsd(
            item.auction,
            ectoPrice,
            bnbPrice
        )).toFixed();
    }, [item, ectoPrice, bnbPrice]);
    if (!item.auction) {
        return <></>;
    }
    return (
        <div className="ItemAuctionPriceDetail">
            {BuyoutDisplay}

            <div className="CurrentBid">
                <Loading loading={!ready}>
                    {t("current_bid", {
                        defaultValue: "Current bid",
                    })}
                    : {getCurrentBid(item.auction).toLocaleString()}{" "}
                    {item.auction && (
                        <span>
                            {getPaymentTokenDisplay(item.auction.paymentToken)}
                        </span>
                    )}
                    <span>
                        &nbsp;($
                        {currentBidPriceInusd})
                    </span>
                </Loading>
            </div>
        </div>
    );
};

const ItemAttributes = ({ item }: { item: SingleCollectionItem }) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "NftTraits",
    });
    return (
        <div className="ItemAttributes">
            {item.attributes
                ? Object.keys(item.attributes).map((attribute, index) => {
                      return (
                          <Grid container key={index} className="attributes">
                              <Grid item className="label" xs={6}>
                                  <Loading loading={!ready}>
                                      {t(attribute, {
                                          defaultValue: attribute,
                                      })}
                                      :
                                  </Loading>
                              </Grid>
                              <Grid item className="attribute" xs={6}>
                                  <Loading loading={!ready}>
                                      <HoverTooltip
                                          tooltip={`Total ${item.attributes[attribute].trait_value}: ${item.attributes[attribute].trait_count}`}
                                      >
                                          <InternalLink
                                              to={`${RouteUtilModel.ROUTES.MARKETPLACE.get()}/${RouteUtilModel.getCategoryRoute(
                                                  {
                                                      collectionAddress:
                                                          item.address.toLowerCase(),
                                                      tokenID: +item.token_id,
                                                  }
                                              )}?${attribute}=${encodeURIComponent(
                                                  item.attributes[attribute]
                                                      .trait_value
                                              )}`}
                                          >
                                              {t(
                                                  item.attributes[attribute]
                                                      .trait_value,
                                                  {
                                                      defaultValue:
                                                          item.attributes[
                                                              attribute
                                                          ].trait_value,
                                                  }
                                              )}
                                              {` (${+(
                                                  (item.attributes[attribute]
                                                      .trait_count /
                                                      item.collection_total) *
                                                  100
                                              ).toFixed(2)}%)`}
                                          </InternalLink>
                                      </HoverTooltip>
                                  </Loading>
                              </Grid>
                          </Grid>
                      );
                  })
                : ""}
        </div>
    );
};

const ItemBiddings = ({
    auction,
    currentTime,
    biddingHistory,
}: {
    auction: SingleCollectionItemAuction;
    currentTime: number;
    biddingHistory: Array<bigint>;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.ItemBiddings",
    });

    const auctionDisplay = useMemo(() => {
        return getAuctionExpireDisplay(auction, currentTime);
    }, [auction, currentTime]);

    const hoursLeftDisplay = useMemo(() => {
        if (auctionDisplay === "Expired") {
            return "";
        }
        return ` ${t("hrs_left", { defaultValue: "hrs left" })}`;
    }, [auctionDisplay, t]);

    const BiddingList = useMemo(() => {
        return biddingHistory.length ? (
            <>
                <Grid container className="BiddingList-Item">
                    <Grid item xs={6} className="left">
                        <Loading loading={!ready}>
                            {t("BiddingList.bid_index", {
                                defaultValue: "Bid Index",
                            })}
                        </Loading>
                    </Grid>
                    <Grid item xs={6} className="right">
                        <div className="bid_amount">
                            <Loading loading={!ready}>
                                {t("BiddingList.bid_amount", {
                                    defaultValue: "Bid Amount",
                                })}
                            </Loading>
                        </div>
                    </Grid>
                </Grid>
                {biddingHistory.reverse().map((bid, index) => {
                    return (
                        <Grid
                            container
                            key={index}
                            className="BiddingList-Item"
                        >
                            <Grid item xs={6} className="left">
                                #{biddingHistory.length - index}
                            </Grid>
                            <Grid item xs={6} className="right">
                                <div className="bid_price">
                                    {
                                        +fromSolidityTokenFormat(
                                            bid,
                                            getPaymentTokenDecimals(
                                                auction.paymentToken
                                            )
                                        )
                                    }{" "}
                                    {getPaymentTokenDisplay(
                                        auction.paymentToken
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    );
                })}
            </>
        ) : (
            <div className="not-found">
                <Loading loading={!ready}>
                    {t("BiddingList.no_biddings_found", {
                        defaultValue: "No biddings found",
                    })}
                    !
                </Loading>
            </div>
        );
    }, [auction, biddingHistory, t, ready]);

    return (
        <div className="ItemBiddings scrollbar scrollable">
            <div className="title text-center">
                <Loading loading={!ready}>
                    {t("biddings", {
                        defaultValue: "Biddings",
                    })}
                </Loading>
            </div>

            <div className="text-center">
                <Loading loading={!ready}>
                    (
                    {auctionDisplay === "Expired"
                        ? t("expired", { defaultValue: auctionDisplay })
                        : auctionDisplay}
                    {hoursLeftDisplay})
                </Loading>
            </div>
            <div className="BiddingList">{BiddingList}</div>
        </div>
    );
};

const TokenOffers = ({
    tokenOffers,
    handleViewTokenOffer,
}: {
    tokenOffers: Array<TokenOffer>;
    handleViewTokenOffer;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.TokenOffers",
    });
    const ectoPrice = useEctoPriceInUsd();
    const bnbPrice = useBnbPriceInUsd();
    return (
        <div className="TokenOffers">
            {tokenOffers.length ? (
                <>
                    <Grid container className="token-offer">
                        <Grid item xs className="row-item ">
                            <Loading loading={!ready}>
                                {t("token_offer_id", {
                                    defaultValue: "Token Offer ID",
                                })}
                            </Loading>
                        </Grid>
                        <Grid item xs className="row-item">
                            <Loading loading={!ready}>
                                {t("payment_token", {
                                    defaultValue: "Payment Token",
                                })}
                            </Loading>
                        </Grid>
                        <Grid item xs className="row-item">
                            <Loading loading={!ready}>
                                {t("amount", {
                                    defaultValue: "Amount",
                                })}
                            </Loading>
                        </Grid>
                        <Grid item xs className="row-item"></Grid>
                    </Grid>
                    {tokenOffers.map((tokenOffer, index) => {
                        return (
                            <Grid
                                container
                                key={`${index}-${tokenOffer.tokenOfferId}`}
                                className="token-offer"
                            >
                                <Grid item xs className="row-item">
                                    #{tokenOffer.tokenOfferId}
                                </Grid>
                                <Grid item xs className="row-item">
                                    {getPaymentTokenDisplay(
                                        tokenOffer.tokenAddress
                                    )}
                                </Grid>
                                <Grid item xs className="row-item">
                                    {(+fromSolidityTokenFormat(
                                        tokenOffer.price,
                                        getPaymentTokenDecimals(
                                            tokenOffer.tokenAddress
                                        )
                                    )).toLocaleString()}{" "}
                                    <span className="usd">
                                        ({"$"}
                                        {getTokenPriceInUsd({
                                            address: tokenOffer.tokenAddress,
                                            amount: tokenOffer.price,
                                            ectoPrice,
                                            bnbPrice,
                                        })}
                                        )
                                    </span>
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    className="row-item align-self-center"
                                >
                                    <OutlinedButton
                                        className="view_offer"
                                        onClick={() => {
                                            handleViewTokenOffer(
                                                tokenOffer,
                                                index
                                            );
                                        }}
                                    >
                                        <Loading loading={!ready}>
                                            {t("view_offer", {
                                                defaultValue: "View Offer",
                                            })}
                                        </Loading>
                                    </OutlinedButton>
                                </Grid>
                            </Grid>
                        );
                    })}
                </>
            ) : (
                <div className="text-center pt-3">
                    <div className="not-found">
                        <Loading loading={!ready}>
                            {t("no_offers_found", {
                                defaultValue: "No Offers Found",
                            })}
                            !
                        </Loading>
                    </div>
                </div>
            )}
        </div>
    );
};

const NftOffers = ({
    nftOffers,
    handleViewNftOffer,
}: {
    nftOffers: Array<NftOffer>;
    handleViewNftOffer: (offer: NftOffer, index: number) => void;
}) => {
    const { t, ready } = useTranslation("translation", {
        keyPrefix: "CollectionItemDetails.NftOffers",
    });

    const { t: t_nft, ready: ready_nft } = useTranslation("translation", {
        keyPrefix: "CollectionNames",
    });

    return (
        <div className="NftOffers">
            {nftOffers.length ? (
                <>
                    <Grid container className="nft-offer">
                        <Grid item xs className="row-item">
                            <Loading loading={!ready}>
                                {t("offer_id", {
                                    defaultValue: "NFT Offer ID",
                                })}
                            </Loading>
                        </Grid>
                        <Grid item xs className="row-item">
                            <Loading loading={!ready}>
                                {t("collection", {
                                    defaultValue: "Collection",
                                })}
                            </Loading>
                        </Grid>
                        <Grid item xs className="row-item">
                            IDs
                        </Grid>
                        <Grid item xs className="row-item"></Grid>
                    </Grid>
                    {nftOffers.map((nftOffer, index) => {
                        return (
                            <Grid
                                container
                                key={`${index}-${nftOffer.nftOfferId}`}
                                className="nft-offer"
                            >
                                <Grid item xs className="row-item">
                                    #{nftOffer.nftOfferId}
                                </Grid>
                                <Grid item xs className="row-item">
                                    <Loading loading={!ready_nft}>
                                        {t_nft(
                                            getNftDisplay(
                                                nftOffer.soldNftAddress
                                            ),
                                            {
                                                defaultValue: getNftDisplay(
                                                    nftOffer.soldNftAddress
                                                ),
                                            }
                                        )}
                                    </Loading>
                                </Grid>
                                <Grid item xs className="row-item">
                                    {nftOffer.soldNftIds.join(", ")}
                                </Grid>
                                <Grid item xs className="row-item">
                                    <OutlinedButton
                                        className="view_offer"
                                        onClick={() => {
                                            handleViewNftOffer(nftOffer, index);
                                        }}
                                    >
                                        <Loading loading={!ready}>
                                            {t("view_offer", {
                                                defaultValue: "View Offer",
                                            })}
                                        </Loading>
                                    </OutlinedButton>
                                </Grid>
                            </Grid>
                        );
                    })}
                </>
            ) : (
                <div className="text-center pt-3">
                    <div className="not-found">
                        <Loading loading={!ready}>
                            {t("no_offers_found", {
                                defaultValue: "No Offers Found",
                            })}
                        </Loading>
                    </div>
                </div>
            )}
        </div>
    );
};
export default CollectionItem;
