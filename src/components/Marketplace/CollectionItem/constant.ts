import {
    ectoSkeletonNFTAddress,
    foundersItemsContractAddress,
    littleGhostNFTAddress,
    lootboxContractAddress,
    souleatersContractAddress,
} from "../../../constants/ContractAddresses";

import RouteUtilModel from "../../../models/util_models/RouteUtilModel";

export const assetCollectionAddressMap = {
    [RouteUtilModel.MARKETPLACE_ITEM_GHOST_URI]: littleGhostNFTAddress,
    [RouteUtilModel.MARKETPLACE_ITEM_SKELETON_URI]: ectoSkeletonNFTAddress,
    [RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI]:
        lootboxContractAddress,
    [RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI]:
        foundersItemsContractAddress,
    [RouteUtilModel.MARKETPLACE_ITEM_SOULEATER_URI]: souleatersContractAddress,
};
