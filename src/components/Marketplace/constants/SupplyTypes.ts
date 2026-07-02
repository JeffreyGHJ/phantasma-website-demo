//TODO: offer (frontend, backend, bots)
//marketplace
//personal wallet
//Make a scheduler that updates box status
//Make a box minting bot and maybe a open bot
//Make a telegram command to show chances /droprate
//Dashboard
//ECTO tax free transfer
//Add missing translations
//...idk gn

import {
    foundersItemsContractAddress,
    lootboxContractAddress,
} from "../../../constants/ContractAddresses";

import RouteUtilModel from "../../../models/util_models/RouteUtilModel";

export const supplyTypes = {
    FOUNDERS_LOOTBOXES: "lootboxes",
    GEMS: "gems",
    POTIONS: "potions",
    RARE_DROPS: "rare_drops",
    ULTRA_RARE_DROPS: "ultra_rare_drops",
};

export const supplyCollectionNameByType = {
    [supplyTypes.FOUNDERS_LOOTBOXES]: "Founder's Lootboxes",
    [supplyTypes.GEMS]: "Founder's Gems",
    [supplyTypes.POTIONS]: "Founder's Potions",
    [supplyTypes.RARE_DROPS]: "Founder's Rare Drops",
    [supplyTypes.ULTRA_RARE_DROPS]: "Founder's Ultra Rare Drops",
};

export const supplyCollectionAddressByType = {
    [supplyTypes.FOUNDERS_LOOTBOXES]: lootboxContractAddress,
    [supplyTypes.GEMS]: foundersItemsContractAddress,
    [supplyTypes.POTIONS]: foundersItemsContractAddress,
    [supplyTypes.RARE_DROPS]: foundersItemsContractAddress,
    [supplyTypes.ULTRA_RARE_DROPS]: foundersItemsContractAddress,
};

export const supplyCollectionPathByType = {
    [supplyTypes.FOUNDERS_LOOTBOXES]:
        RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI,
    [supplyTypes.GEMS]: RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
    [supplyTypes.POTIONS]: RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
    [supplyTypes.RARE_DROPS]: RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
    [supplyTypes.ULTRA_RARE_DROPS]:
        RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI,
};

export const allSupplyTypes = Object.values(supplyTypes);
