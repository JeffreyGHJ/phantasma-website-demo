import {
    closeWalletModal,
    openWalletModal,
    overrideNavbarStickiness,
    resumeNavbarStickiness,
    toggleMemoryMode,
    toggleQuickSpin,
    toggleSettingsMenu,
    toggleView3d,
    toggleWalletModal,
    updateAccountBnbBalance,
    updateAccountBusdBalance,
    updateAccountClaimableBnbRewards,
    updateAccountClaimableBusdRewards,
    updateAccountClaimableWbnbRewards,
    updateAccountEctoBalance,
    updateAccountFoundersItems,
    updateAccountFoundersLootboxes,
    updateAccountGhosts,
    updateAccountGhostsMintCount,
    updateAccountOldEctoBalance,
    updateAccountSkeletons,
    updateAccountSolanaAssets,
    updateAccountSoulEaters,
    updateAccountWbnbBalance,
    updateAlertDisplayPosition,
    updateBlockNumber,
    updateBnbPrice,
    updateConnectorID,
    updateEctoPrice,
    updateNftsPerPage,
    updateOfferEmailNotification,
    updateOverlay,
    updatePreferredNftImageSize,
    updateSoulEaters,
    updateUser,
} from "./actions";

import AccountItems from "./types/AccountItems";
import AccountModel from "../../models/AccountModel";
import AlertDisplayPositionUtilModel from "../../models/util_models/AlertDisplayPositionUtilModel";
import { KEYS } from "../../utils/LocalstorageUtil";
import NftImageSizeUtilModel from "../../models/util_models/NftImageSizeUtilModel";
import NftPerPageUtilModel from "../../models/util_models/NftPerPageUtilModel";
import User from "../../constants/types/User";
import { createReducer } from "@reduxjs/toolkit";
import { isUndefined } from "lodash";
import updateUserWalletAddresses from "./actions/user/updateUserWalletAddresses";

export interface ApplicationState {
    blockNumber: { [chainId: number]: number };
    walletModalOpen: boolean;
    settingsMenuOpen: boolean;
    connectorID: string | null;
    accountBnbBalance: string;
    accountEctoBalance: string;
    accountOldEctoBalance: string;
    accountBusdBalance: string;
    accountWbnbBalance: string;
    ectoPriceInUsd: number;
    bnbPriceInUsd: number;
    accountGhosts: AccountItems;
    accountSoulEaters: any;
    accountSkeletons: AccountItems;
    accountFoundersLootboxes: AccountItems;
    accountFoundersItems: AccountItems;
    accountSolanaAssets: any;
    soulEatersMetadata: any;
    overrodeNavbarStickiness: boolean;
    accountClaimableBnbRewards: number;
    accountClaimableWbnbRewards: number;
    accountClaimableBusdRewards: number;
    accountGhostsMintCount: number;
    user: User | null;
    // Overlay loading that prevents user from interacting further with the site
    overlay: boolean;
    /* User settings */
    view3d: boolean;
    preferredNftImageSize: number;
    nftsPerPage: number;
    alertDisplayPosition: string;
    offerEmailNotification: boolean;
    quickSpin: boolean;
    memoryMode: boolean;
    /* End User Settings*/
}

const getInitialPreferredNftImageSize = () => {
    let size: string | number | null = localStorage.getItem(
        KEYS.preferredNftImageSize
    );
    if (size && !isNaN(+size)) {
        size = +size;

        if (
            size >= NftImageSizeUtilModel.MINIMUM_NFT_SIZE &&
            size <= NftImageSizeUtilModel.MAXIMUM_NFT_SIZE
        ) {
            return size;
        }
    }
    return 250;
};

const getInitialNftsPerPage = () => {
    let perPage: string | number | null = localStorage.getItem(
        KEYS.nftsPerPage
    );
    if (perPage && !isNaN(+perPage)) {
        perPage = +perPage;

        if (
            perPage >= NftPerPageUtilModel.MINIMUM_NFT_PER_PAGE &&
            perPage <= NftPerPageUtilModel.MAXIMUM_NFT_PER_PAGE
        ) {
            return perPage;
        }
    }
    return 100;
};

const initialState: ApplicationState = {
    blockNumber: {},
    walletModalOpen: false,
    settingsMenuOpen: false,
    connectorID: localStorage.getItem(KEYS.connectorID),
    accountBnbBalance: "0",
    accountEctoBalance: "0",
    accountOldEctoBalance: "0",
    accountBusdBalance: "0",
    accountWbnbBalance: "0",
    ectoPriceInUsd: 0,
    bnbPriceInUsd: 0,
    accountGhosts: {
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    },
    accountSoulEaters: [],
    accountSkeletons: {
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    },
    accountFoundersLootboxes: {
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    },
    accountFoundersItems: {
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    },
    accountSolanaAssets: [],
    soulEatersMetadata: [],
    overrodeNavbarStickiness: false,
    accountClaimableBnbRewards: 0,
    accountClaimableWbnbRewards: 0,
    accountClaimableBusdRewards: 0,
    accountGhostsMintCount: 0,
    user: AccountModel.loadUserFromLocalstorage(),
    overlay: false,
    /* User Settings */
    view3d: localStorage.getItem(KEYS.view3d)
        ? localStorage.getItem(KEYS.view3d) === "true"
        : true,
    preferredNftImageSize: getInitialPreferredNftImageSize(),
    nftsPerPage: getInitialNftsPerPage(),
    alertDisplayPosition:
        localStorage.getItem(KEYS.alertDisplayPosition) ||
        AlertDisplayPositionUtilModel.notifstackPositionSelectionKeys.TOP_RIGHT,
    offerEmailNotification: !!(
        localStorage.getItem(KEYS.offerEmailNotification) === "true"
    ),
    quickSpin: localStorage.getItem(KEYS.quickSpin) === "true",
    memoryMode: localStorage.getItem(KEYS.memoryMode) === "true",
};

export default createReducer(initialState, (builder) =>
    builder
        .addCase(updateBlockNumber, (state, action) => {
            const { chainId, blockNumber } = action.payload;
            if (typeof state.blockNumber[chainId] !== "number") {
                state.blockNumber[chainId] = blockNumber;
            } else {
                state.blockNumber[chainId] = Math.max(
                    blockNumber,
                    state.blockNumber[chainId]
                );
            }
        })
        .addCase(updateConnectorID, (state, action) => {
            const { connectorID } = action.payload;
            state.connectorID = connectorID;
            localStorage.setItem(KEYS.connectorID, connectorID || "");
        })
        .addCase(toggleWalletModal, (state) => {
            state.walletModalOpen = !state.walletModalOpen;
        })
        .addCase(openWalletModal, (state) => {
            state.walletModalOpen = true;
        })
        .addCase(closeWalletModal, (state) => {
            state.walletModalOpen = false;
        })
        .addCase(toggleSettingsMenu, (state) => {
            state.settingsMenuOpen = !state.settingsMenuOpen;
        })
        .addCase(updateAccountBnbBalance, (state, action) => {
            const { balance } = action.payload;
            state.accountBnbBalance = balance;
        })
        .addCase(updateAccountEctoBalance, (state, action) => {
            const { balance } = action.payload;
            state.accountEctoBalance = balance;
        })
        .addCase(updateAccountOldEctoBalance, (state, action) => {
            const { balance } = action.payload;
            state.accountOldEctoBalance = balance;
        })
        .addCase(updateAccountBusdBalance, (state, action) => {
            const { balance } = action.payload;
            state.accountBusdBalance = balance;
        })
        .addCase(updateAccountWbnbBalance, (state, action) => {
            const { balance } = action.payload;
            state.accountWbnbBalance = balance;
        })
        .addCase(updateAccountGhosts, (state, action) => {
            const { accountItems } = action.payload;
            state.accountGhosts = accountItems;
        })
        .addCase(updateAccountSoulEaters, (state, action) => {
            const accountSoulEaters = action.payload;
            state.accountSoulEaters = accountSoulEaters;
        })
        .addCase(updateAccountSkeletons, (state, action) => {
            const { accountItems } = action.payload;
            state.accountSkeletons = accountItems;
        })
        .addCase(updateAccountFoundersLootboxes, (state, action) => {
            const { accountItems } = action.payload;
            state.accountFoundersLootboxes = accountItems;
        })
        .addCase(updateAccountFoundersItems, (state, action) => {
            const { accountItems } = action.payload;
            state.accountFoundersItems = accountItems;
        })
        .addCase(updateAccountSolanaAssets, (state, action) => {
            const accountSolanaAssets = action.payload;
            state.accountSolanaAssets = accountSolanaAssets;
        })
        .addCase(updateSoulEaters, (state, action) => {
            const soulEatersMetadata = action.payload;
            state.soulEatersMetadata = soulEatersMetadata;
        })
        .addCase(updateBnbPrice, (state, action) => {
            const { price } = action.payload;
            state.bnbPriceInUsd = price;
        })
        .addCase(updateEctoPrice, (state, action) => {
            const { price } = action.payload;
            state.ectoPriceInUsd = price;
        })
        .addCase(overrideNavbarStickiness, (state) => {
            state.overrodeNavbarStickiness = true;
        })
        .addCase(resumeNavbarStickiness, (state) => {
            state.overrodeNavbarStickiness = false;
        })
        .addCase(updateAccountClaimableBnbRewards, (state, action) => {
            const { rewards } = action.payload;
            state.accountClaimableBnbRewards = rewards;
        })
        .addCase(updateAccountClaimableWbnbRewards, (state, action) => {
            const { rewards } = action.payload;
            state.accountClaimableWbnbRewards = rewards;
        })
        .addCase(updateAccountClaimableBusdRewards, (state, action) => {
            const { rewards } = action.payload;
            state.accountClaimableBusdRewards = rewards;
        })
        .addCase(updateAccountGhostsMintCount, (state, action) => {
            const { count } = action.payload;
            state.accountGhostsMintCount = count;
        })
        .addCase(updateUser, (state, action) => {
            const { user } = action.payload;
            if (user && !user.settings) {
                user.settings = [];
            }
            state.user = user;
            localStorage.setItem(
                KEYS.user,
                isUndefined(user) ? "" : JSON.stringify(user)
            );
        })
        .addCase(updateUserWalletAddresses, (state, action) => {
            const { walletAddresses } = action.payload;
            const _user = state.user;
            if (_user) {
                _user.wallet_addresses = walletAddresses;
                localStorage.setItem(
                    KEYS.user,
                    isUndefined(_user) ? "" : JSON.stringify(_user)
                );
            }
        })
        .addCase(updateOverlay, (state, action) => {
            const { overlay } = action.payload;
            state.overlay = overlay;
        })
        /* User Settings */
        .addCase(updatePreferredNftImageSize, (state, action) => {
            const { size } = action.payload;
            if (
                size >= NftImageSizeUtilModel.MINIMUM_NFT_SIZE &&
                size <= NftImageSizeUtilModel.MAXIMUM_NFT_SIZE
            ) {
                state.preferredNftImageSize = size;
                localStorage.setItem(
                    KEYS.preferredNftImageSize,
                    size.toString()
                );
            }
        })
        .addCase(updateNftsPerPage, (state, action) => {
            const { perPage } = action.payload;
            if (
                perPage >= NftPerPageUtilModel.MINIMUM_NFT_PER_PAGE &&
                perPage <= NftPerPageUtilModel.MAXIMUM_NFT_PER_PAGE
            ) {
                state.nftsPerPage = perPage;
                localStorage.setItem(KEYS.nftsPerPage, perPage.toString());
            }
        })
        .addCase(updateAlertDisplayPosition, (state, action) => {
            const { position } = action.payload;
            state.alertDisplayPosition = position;
            localStorage.setItem(KEYS.alertDisplayPosition, position);
        })
        .addCase(updateOfferEmailNotification, (state, action) => {
            const { receive } = action.payload;
            state.offerEmailNotification = receive;
            localStorage.setItem(
                KEYS.offerEmailNotification,
                receive.toString()
            );
        })
        .addCase(toggleView3d, (state) => {
            const _view3d = !state.view3d;
            state.view3d = _view3d;
            localStorage.setItem(KEYS.view3d, _view3d.toString());
        })
        .addCase(toggleQuickSpin, (state) => {
            const _quickSpin = !state.quickSpin;
            state.quickSpin = _quickSpin;
            localStorage.setItem(KEYS.quickSpin, _quickSpin.toString());
        })
        .addCase(toggleMemoryMode, (state) => {
            const _memoryMode = !state.memoryMode;
            state.memoryMode = _memoryMode;
            localStorage.setItem(KEYS.memoryMode, _memoryMode.toString());
        })
);
