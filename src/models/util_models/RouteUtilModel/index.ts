import {
    ectoSkeletonNFTAddress,
    foundersItemsContractAddress,
    littleGhostNFTAddress,
    lootboxContractAddress,
    souleatersContractAddress,
} from "../../../constants/ContractAddresses";

import MarketplaceNftUri from "../MarketplaceUtilModel/types/MarketplaceNftUri";
import { isUndefined } from "lodash";

class RouteUtilModel {
    static MARKETPLACE_ITEM_GHOST_URI = "ghost";
    static MARKETPLACE_ITEM_SKELETON_URI = "skeleton";
    static MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI = "founder_lootbox";
    static MARKETPLACE_ITEM_FOUNDER_ITEM_URI = "founder_item";
    static MARKETPLACE_ITEM_SOULEATER_URI = "souleater";

    static CATEGORY_ROUTES_TAB_MAP = {
        ghosts: 0,
        pets: 1,
        armory: 2,
        supplies: 3,
        multipliers: 4,
        souleaters: 5,
    };

    static CATEGORY_ROUTES_TAB_REVERSE_MAP = {
        0: "ghosts",
        1: "pets",
        2: "armory",
        3: "supplies",
        4: "multipliers",
        5: "souleaters",
    };

    static COLLECTION_ADDRESS_TO_MARKETPLACE_ITEM_URI = {
        [littleGhostNFTAddress]: RouteUtilModel.MARKETPLACE_ITEM_GHOST_URI,
        [ectoSkeletonNFTAddress]: RouteUtilModel.MARKETPLACE_ITEM_SKELETON_URI,
        [lootboxContractAddress]:
            RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI,
        [foundersItemsContractAddress]:
            RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
        [souleatersContractAddress]:
            RouteUtilModel.MARKETPLACE_ITEM_SOULEATER_URI,
    };

    static PROFILE_SECTIONS = {
        DASHBOARD: "dashboard",
        INVENTORY: "vault",
        OFFERS: "offers",
        CLAIM_REWARDS: "rewards",
        FAVORITES: "favorites",
        ACCOUNT_SETTINGS: "settings",
        EARNING_CALCULATOR: "earning-calculator",
    };

    static getCategoryRoute = ({
        collectionAddress,
        tokenID,
    }: {
        collectionAddress: string;
        tokenID?: number;
    }): MarketplaceNftUri => {
        if (collectionAddress === littleGhostNFTAddress) {
            return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.ghosts
            ];
        }

        if (collectionAddress === ectoSkeletonNFTAddress) {
            return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.pets
            ];
        }

        if (collectionAddress === lootboxContractAddress) {
            return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.supplies
            ];
        }

        if (collectionAddress === foundersItemsContractAddress) {
            if (isUndefined(tokenID)) {
                throw new Error("Token ID is not defined");
            }
            if (tokenID > 21020) {
                throw new Error("Token ID out of range");
            }
            if (tokenID < 10000) {
                return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                    RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.supplies
                ];
            }
            if (tokenID < 20000) {
                return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                    RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.armory
                ];
            }
            return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.supplies
            ];
        }

        if (collectionAddress === souleatersContractAddress) {
            return RouteUtilModel.CATEGORY_ROUTES_TAB_REVERSE_MAP[
                RouteUtilModel.CATEGORY_ROUTES_TAB_MAP.souleaters
            ];
        }

        throw new Error("Unsupported collection");
    };

    static ROUTES = {
        MARKETPLACE: {
            get: () => {
                return "/marketplace";
            },
            PROFILE: {
                get: () => {
                    return "/marketplace/profile";
                },
                SETTINGS: {
                    get: () => {
                        return `/marketplace/profile/${RouteUtilModel.PROFILE_SECTIONS.ACCOUNT_SETTINGS}`;
                    },
                },
                EARNING_CALCULATOR: {
                    get: () => {
                        return `/marketplace/profile/${RouteUtilModel.PROFILE_SECTIONS.EARNING_CALCULATOR}`;
                    },
                },
                FAVORITES: {
                    get: () => {
                        return `/marketplace/profile/${RouteUtilModel.PROFILE_SECTIONS.FAVORITES}`;
                    },
                    PETS: {
                        get: () => {
                            return "/marketplace/profile/favorites/pets";
                        },
                    },
                    GHOSTS: {
                        get: () => {
                            return "/marketplace/profile/favorites/ghosts";
                        },
                    },
                },
                INVENTORY: {
                    get: () => {
                        "/marketplace/profile/vault";
                    },
                    PETS: {
                        get: () => {
                            return "/marketplace/profile/vault/pets";
                        },
                    },
                    GHOSTS: {
                        get: () => {
                            return "/marketplace/profile/vault/ghosts";
                        },
                    },
                    SUPPLIES: {
                        get: () => {
                            return "/marketplace/profile/vault/supplies";
                        },
                    },
                },
            },
        },
        NFT_BRIDGE: {
            get: () => {
                return "/nftbridge";
            },
        },
        MINT: {
            get: () => {
                return "/mint";
            },
        },
    };
}

export default RouteUtilModel;
