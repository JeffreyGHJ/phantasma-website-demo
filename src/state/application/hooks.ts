//TODO: Move these to ./hooks folder. This file has gotten too big

import {
    closeWalletModal,
    openWalletModal,
    overrideNavbarStickiness,
    resumeNavbarStickiness,
    toggleMemoryMode,
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
import { useDispatch, useSelector } from "react-redux";

import AccountItems from "./types/AccountItems";
import { AppState } from "../index";
import User from "../../constants/types/User";
import { useActiveWeb3React } from "../../hooks";
import { useCallback } from "react";

export function useBlockNumber(): number | undefined {
    const { chainId } = useActiveWeb3React();

    return useSelector(
        (state: AppState) => state.application.blockNumber[chainId ?? -1]
    );
}

export function useWalletModalOpen(): boolean {
    return useSelector((state: AppState) => state.application.walletModalOpen);
}

export function useWalletModalToggle(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(toggleWalletModal()), [dispatch]);
}

export const useOpenWalletModal = (): (() => void) => {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(openWalletModal()), [dispatch]);
};

export const useCloseWalletModal = (): (() => void) => {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(closeWalletModal()), [dispatch]);
};

export function useSettingsMenuOpen(): boolean {
    return useSelector((state: AppState) => state.application.settingsMenuOpen);
}

export function useToggleSettingsMenu(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(toggleSettingsMenu()), [dispatch]);
}

export const useConnectorID = (): string | null => {
    return useSelector((state: AppState) => state.application.connectorID);
};

export const useUpdateConnectorID = (): ((
    connectorID: string | null
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (connectorID) => dispatch(updateConnectorID({ connectorID })),
        [dispatch]
    );
};

// Account BNB Balance
export const useAccountBnbBalance = (): string => {
    return useSelector(
        (state: AppState) => state.application.accountBnbBalance
    );
};

export const useUpdateAccountBnbBalance = (): ((balance: string) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (balance) => dispatch(updateAccountBnbBalance({ balance })),
        [dispatch]
    );
};

// Account ECTO Balance
export const useAccountEctoBalance = (): string => {
    return useSelector(
        (state: AppState) => state.application.accountEctoBalance
    );
};

export const useUpdateAccountEctoBalance = (): ((balance: string) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (balance) => dispatch(updateAccountEctoBalance({ balance })),
        [dispatch]
    );
};

// Account Old ECTO Balance
export const useAccountOldEctoBalance = (): string => {
    return useSelector(
        (state: AppState) => state.application.accountOldEctoBalance
    );
};

export const useUpdateAccountOldEctoBalance = (): ((
    balance: string
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (balance) => dispatch(updateAccountOldEctoBalance({ balance })),
        [dispatch]
    );
};

// Account BUSD Balance
export const useAccountBusdBalance = (): string => {
    return useSelector(
        (state: AppState) => state.application.accountBusdBalance
    );
};

export const useUpdateAccountBusdBalance = (): ((balance: string) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (balance) => dispatch(updateAccountBusdBalance({ balance })),
        [dispatch]
    );
};

// Account WBNB Balance
export const useAccountWbnbBalance = (): string => {
    return useSelector(
        (state: AppState) => state.application.accountWbnbBalance
    );
};

export const useUpdateAccountWbnbBalance = (): ((balance: string) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (balance) => dispatch(updateAccountWbnbBalance({ balance })),
        [dispatch]
    );
};

// Account Ghosts
export const useAccountGhosts = (): AccountItems => {
    return useSelector((state: AppState) => state.application.accountGhosts);
};

export const useUpdateAccountGhosts = (): ((items: AccountItems) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) => dispatch(updateAccountGhosts({ accountItems: items })),
        [dispatch]
    );
};

// Account SoulEaters
export const useAccountSoulEaters = (): any => {
    return useSelector(
        (state: AppState) => state.application.accountSoulEaters
    );
};

export const useUpdateAccountSoulEaters = (): ((items: any) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) => dispatch(updateAccountSoulEaters(items)),
        [dispatch]
    );
};

// Account Skeletons
export const useAccountSkeletons = (): AccountItems => {
    return useSelector((state: AppState) => state.application.accountSkeletons);
};

export const useUpdateAccountSkeletons = (): ((
    items: AccountItems
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) => dispatch(updateAccountSkeletons({ accountItems: items })),
        [dispatch]
    );
};

// Account Founders Lootboxes
export const useAccountFoundersLootboxes = (): AccountItems => {
    return useSelector(
        (state: AppState) => state.application.accountFoundersLootboxes
    );
};

export const useUpdateAccountFoundersLootboxes = (): ((
    items: AccountItems
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) =>
            dispatch(updateAccountFoundersLootboxes({ accountItems: items })),
        [dispatch]
    );
};

// Account Founders Items
export const useAccountFoundersItems = (): AccountItems => {
    return useSelector(
        (state: AppState) => state.application.accountFoundersItems
    );
};

export const useUpdateAccountFoundersItems = (): ((
    items: AccountItems
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) =>
            dispatch(updateAccountFoundersItems({ accountItems: items })),
        [dispatch]
    );
};

// Account Solana Assets
export const useAccountSolanaAssets = (): any => {
    return useSelector(
        (state: AppState) => state.application.accountSolanaAssets
    );
};

export const useUpdateAccountSolanaAssets = (): ((items: any) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (items) => dispatch(updateAccountSolanaAssets(items)),
        [dispatch]
    );
};

// SoulEaters Metadata
export const useSouleaters = (): any => {
    return useSelector(
        (state: AppState) => state.application.soulEatersMetadata
    );
};

export const useUpdateSoulEaters = (): ((data: any) => void) => {
    const dispatch = useDispatch();
    return useCallback((data) => dispatch(updateSoulEaters(data)), [dispatch]);
};

// BNB price
export const useBnbPriceInUsd = (): number => {
    return useSelector((state: AppState) => state.application.bnbPriceInUsd);
};
export const useUpdateBnbPriceInUsd = (): ((price: number) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (price) => dispatch(updateBnbPrice({ price })),
        [dispatch]
    );
};

// ECTO Price
export const useEctoPriceInUsd = (): number => {
    return useSelector((state: AppState) => state.application.ectoPriceInUsd);
};
export const useUpdateEctoPriceInUsd = (): ((price: number) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (price) => dispatch(updateEctoPrice({ price })),
        [dispatch]
    );
};

// Navbar Stickiness
export const useOverrodeNavbarStickiness = (): boolean => {
    return useSelector(
        (state: AppState) => state.application.overrodeNavbarStickiness
    );
};
export function useOverrideNavbarStickiness(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(overrideNavbarStickiness()), [dispatch]);
}
export function useResumeNavbarStickiess(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(resumeNavbarStickiness()), [dispatch]);
}

// Claimable bnb rewards
export const useAccountClaimableBnbRewards = (): number => {
    return useSelector(
        (state: AppState) => state.application.accountClaimableBnbRewards
    );
};

export const useUpdateAccountClaimableBnbRewards = (): ((
    rewards: number
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (rewards) => dispatch(updateAccountClaimableBnbRewards({ rewards })),
        [dispatch]
    );
};

// Claimable wbnb rewards
export const useAccountClaimableWbnbRewards = (): number => {
    return useSelector(
        (state: AppState) => state.application.accountClaimableWbnbRewards
    );
};

export const useUpdateAccountClaimableWbnbRewards = (): ((
    rewards: number
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (rewards) => dispatch(updateAccountClaimableWbnbRewards({ rewards })),
        [dispatch]
    );
};

// Claimable busd rewards
export const useAccountClaimableBusdRewards = (): number => {
    return useSelector(
        (state: AppState) => state.application.accountClaimableBusdRewards
    );
};

export const useUpdateAccountClaimableBusdRewards = (): ((
    rewards: number
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (rewards) => dispatch(updateAccountClaimableBusdRewards({ rewards })),
        [dispatch]
    );
};

// Account ghosts mint count
export const useAccountGhostsMintCount = (): number => {
    return useSelector(
        (state: AppState) => state.application.accountGhostsMintCount
    );
};

export const useUpdateAccountGhostsMintCount = (): ((
    count: number
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (count) => dispatch(updateAccountGhostsMintCount({ count })),
        [dispatch]
    );
};

// Preferred NFT Image Size
export const usePreferredNftImageSize = (): number => {
    return useSelector(
        (state: AppState) => state.application.preferredNftImageSize
    );
};

export const useUpdatePreferredNftImageSize = (): ((size: number) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (size) => dispatch(updatePreferredNftImageSize({ size })),
        [dispatch]
    );
};

// Nfts per page
export const useNftsPerPage = (): number => {
    return useSelector((state: AppState) => state.application.nftsPerPage);
};

export const useUpdateNftsPerPage = (): ((size: number) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (perPage) => dispatch(updateNftsPerPage({ perPage })),
        [dispatch]
    );
};

// Alert display position
export const useAlertDisplayPosition = (): string => {
    return useSelector(
        (state: AppState) => state.application.alertDisplayPosition
    );
};

export const useUpdateAlertDisplayPosition = (): ((
    position: string
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (position) => dispatch(updateAlertDisplayPosition({ position })),
        [dispatch]
    );
};

// User
export const useUser = (): User | null => {
    return useSelector((state: AppState) => state.application.user);
};

export const useUpdateUser = (): ((user: User | null) => void) => {
    const dispatch = useDispatch();
    return useCallback((user) => dispatch(updateUser({ user })), [dispatch]);
};

// Overlay
export const useOverlay = (): boolean => {
    return useSelector((state: AppState) => state.application.overlay);
};

export const useUpdateOverlay = (): ((overlay: boolean) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (overlay) => dispatch(updateOverlay({ overlay })),
        [dispatch]
    );
};

// Offer Email Notification
export const useOfferEmailNotification = (): boolean => {
    return useSelector(
        (state: AppState) => state.application.offerEmailNotification
    );
};

export const useUpdateOfferEmailNotification = (): ((
    receive: boolean
) => void) => {
    const dispatch = useDispatch();
    return useCallback(
        (receive) => dispatch(updateOfferEmailNotification({ receive })),
        [dispatch]
    );
};

export function useView3d(): boolean {
    return useSelector((state: AppState) => state.application.view3d);
}

export function useToggleView3d(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(toggleView3d()), [dispatch]);
}

export function useMemoryMode(): boolean {
    return useSelector((state: AppState) => state.application.memoryMode);
}

export function useToggleMemoryMode(): () => void {
    const dispatch = useDispatch();
    return useCallback(() => dispatch(toggleMemoryMode()), [dispatch]);
}
