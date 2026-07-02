import AccountItems from "./types/AccountItems";
import User from "../../constants/types/User";
import { createAction } from "@reduxjs/toolkit";

export const updateBlockNumber = createAction<{
    chainId: number;
    blockNumber: number;
}>("app/updateBlockNumber");
export const updateConnectorID = createAction<{ connectorID: string | null }>(
    "app/updateConnectorID"
);
export const toggleWalletModal = createAction<void>("app/toggleWalletModal");
export const openWalletModal = createAction<void>("app/openWalletModal");
export const closeWalletModal = createAction<void>("app/closeWalletModal");
export const toggleSettingsMenu = createAction<void>("app/toggleSettingsMenu");
export const updateAccountBnbBalance = createAction<{ balance: string }>(
    "app/updateAccountBnbBalance"
);
export const updateAccountEctoBalance = createAction<{ balance: string }>(
    "app/updateAccountEctoBalance"
);
export const updateAccountOldEctoBalance = createAction<{ balance: string }>(
    "app/updateAccountOldEctoBalance"
);
export const updateAccountBusdBalance = createAction<{ balance: string }>(
    "app/updateAccountBusdBalance"
);
export const updateAccountWbnbBalance = createAction<{ balance: string }>(
    "app/updateAccountWbnbBalance"
);
export const updateAccountGhosts = createAction<{ accountItems: AccountItems }>(
    "app/updateAccountGhosts"
);
export const updateAccountSoulEaters = createAction<{ items: any }>(
    "app/updateAccountSoulEaters"
);
export const updateAccountSkeletons = createAction<{
    accountItems: AccountItems;
}>("app/updateAccountSkeletons");

export const updateAccountFoundersLootboxes = createAction<{
    accountItems: AccountItems;
}>("app/updateAccountFoundersLootboxes");
export const updateAccountFoundersItems = createAction<{
    accountItems: AccountItems;
}>("app/updateAccountFoundersItems");
export const updateAccountSolanaAssets = createAction<{
    accountSolanaAssets: any;
}>("app/updateAccountSolanaAssets");
export const updateSoulEaters = createAction<{
    soulEatersMetadata: any;
}>("app/updateSoulEatersMetadata");
export const updateBnbPrice = createAction<{ price: number }>(
    "app/updateBnbPrice"
);
export const updateEctoPrice = createAction<{ price: number }>(
    "app/updateEctoPrice"
);
export const overrideNavbarStickiness = createAction<void>(
    "app/overrideNavbarStickiness"
);
export const resumeNavbarStickiness = createAction<void>(
    "app/resumeNavbarStickiness"
);
export const updateAccountClaimableBnbRewards = createAction<{
    rewards: number;
}>("app/updateAccountClaimableBnbRewards");
export const updateAccountClaimableWbnbRewards = createAction<{
    rewards: number;
}>("app/updateAccountClaimableWbnbRewards");
export const updateAccountClaimableBusdRewards = createAction<{
    rewards: number;
}>("app/updateAccountClaimableBusdRewards");
export const updateAccountGhostsMintCount = createAction<{
    count: number;
}>("app/updateAccountGhostsMintCount");
export const updateOverlay = createAction<{
    overlay: boolean;
}>("app/updateOverlay");

// User
export const updateUser = createAction<{
    user: User | null;
}>("app/updateUser");

// User settings
export const updateOfferEmailNotification = createAction<{
    receive: boolean;
}>("app/offerEmailNotification");
export const updateNftsPerPage = createAction<{
    perPage: number;
}>("app/updateNftsPerPage");
export const updatePreferredNftImageSize = createAction<{
    size: number;
}>("app/updatePreferredNftImageSize");
export const updateAlertDisplayPosition = createAction<{
    position: string;
}>("app/updateAlertDisplayPosition");
export const toggleView3d = createAction<void>("app/toggleView3d");
export const toggleQuickSpin = createAction<void>("app/toggleQuickSpin");
export const toggleMemoryMode = createAction<void>("app/toggleMemoryMode");
