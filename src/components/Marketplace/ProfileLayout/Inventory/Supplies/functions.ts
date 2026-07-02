import {
    foundersItemsContractAddress,
    lootboxContractAddress,
} from "../../../../../constants/ContractAddresses";
import LootboxABI from "../../../../../constants/abis/bsc/LootboxABI";
import { supplyTypes as _supplyTypes } from "../../../constants/SupplyTypes";
import { saleTypes } from "../../../constants/saleTypes";
import { sortTypes } from "../../../constants/sortTypes";
import LootboxUtilModel from "../../../../../models/util_models/LootboxUtilModel";
import Web3 from "web3";
import { activeNode } from "../../../../../constants/Nodes";
import { Multicall } from "ethereum-multicall";
import RouteUtilModel from "../../../../../models/util_models/RouteUtilModel";

const allSupplyTypes = Object.values(_supplyTypes);
const web3 = new Web3(activeNode);
const multicall = new Multicall({ web3Instance: web3, tryAggregate: false });

export const updateSupplyTypes = (slectedType, supplyTypes, setSupplyTypes) => {
    if (supplyTypes.includes(slectedType)) {
        let update = supplyTypes.filter((type) => type !== slectedType);
        update.length ? setSupplyTypes(update) : setSupplyTypes(allSupplyTypes);
    } else {
        setSupplyTypes([...supplyTypes, slectedType]);
    }
};

export const matchesSupplyTypes = (item, supplyTypes) => {
    // If item is lootbox
    if (item.address === lootboxContractAddress) {
        if (supplyTypes.includes(_supplyTypes.FOUNDERS_LOOTBOXES)) {
            return true;
        }
    }

    // If item is founders item
    if (item.address === foundersItemsContractAddress) {
        if (supplyTypes.includes(_supplyTypes.GEMS)) {
            if (item.id < 10000) return true;
        }
        if (supplyTypes.includes(_supplyTypes.POTIONS)) {
            if (item.id >= 20000 && item.id < 21000) return true;
        }
        if (supplyTypes.includes(_supplyTypes.RARE_DROPS)) {
            if (item.id >= 21000 && item.id < 21020) return true;
        }
        if (supplyTypes.includes(_supplyTypes.ULTRA_RARE_DROPS)) {
            if (item.id === 21020) return true;
        }
    }

    return false;
};

export const matchesFilters = (item, activeFilters) => {
    // determine the itemType
    let itemType = "";
    if (item.address === lootboxContractAddress) {
        itemType = _supplyTypes.FOUNDERS_LOOTBOXES;
    } else if (item.address === foundersItemsContractAddress) {
        if (item.id < 10000) itemType = _supplyTypes.GEMS;
        else if (item.id >= 20000 && item.id < 21000)
            itemType = _supplyTypes.POTIONS;
        else if (item.id >= 21000 && item.id < 21020)
            itemType = _supplyTypes.RARE_DROPS;
        else if (item.id === 21020) itemType = _supplyTypes.ULTRA_RARE_DROPS;
    }

    // if no itemType then it doesnt belong in supply tab
    if (itemType === "") return false;

    // if the item type has no mapping in active filters return it
    if (!activeFilters[itemType]) return true;

    let itemTraits = Object.values(item.trait_type_value) as any;

    // LOOTBOX FILTERING
    if (itemType === _supplyTypes.FOUNDERS_LOOTBOXES) {
        let lootboxFilterEntries = Object.entries(activeFilters[itemType]);
        let filteredValuesCount = 0;

        lootboxFilterEntries.map((filterEntry: any) => {
            filteredValuesCount += filterEntry[1].length;
        });

        if (filteredValuesCount === 0) return true;

        // lootboxes can be filtered on multiple categories
        for (let filterEntry of lootboxFilterEntries) {
            const traitType = filterEntry[0];
            const filteredValues = filterEntry[1] as any;
            const lootboxTraits =
                traitType === "Status"
                    ? item.status
                    : item.trait_type_value[traitType];
            // console.log("traitType: ", traitType);
            // console.log("filteredValues: ", filteredValues);
            // console.log(`lootbox-${traitType} traits: `, lootboxTraits);

            if (filteredValues.length < 1) continue;

            // Handle "Unrevealed" traits
            if (filteredValues.includes("Unrevealed") && lootboxTraits === "-")
                continue;

            // Handle "Status"
            if (traitType === "Status" && filteredValues.includes(item.status))
                continue;

            // Handle all other traits
            for (let filteredValue of filteredValues) {
                if (lootboxTraits.includes(filteredValue)) continue;
            }

            // item did not pass filters in this category
            return false;
        }

        // item passed filters across all categories
        return true;
    } else {
        // FILTER NON LOOTBOX ITEMS
        let selectedTraits = Object.values(activeFilters[itemType])[0] as any;
        if (selectedTraits.length === 0) return true;
        for (let trait of selectedTraits) {
            if (itemTraits.includes(trait)) return true;
        }
    }

    return false;
};

export const matchesSaleType = (item, saleType) => {
    if (saleType === saleTypes.ALL) return true;
    if (saleType === saleTypes.NOT_FOR_SALE) return !item.price;
    if (saleType === saleTypes.AUCTION) return !!item.auctionID;
    if (saleType === saleTypes.FOR_SALE) return !!item.price && !item.auctionID;
    return false;
};

export const filterItems = (items, supplyTypes, activeFilters, saleType) => {
    let _items = [] as any;

    items.map((item) => {
        if (!matchesSupplyTypes(item, supplyTypes)) return;
        if (!matchesFilters(item, activeFilters)) return;
        if (!matchesSaleType(item, saleType)) return;
        _items.push(item);
    });

    return _items;
};

export const sortItems = (items, sortType) => {
    items.sort((a, b) => {
        if (sortType === sortTypes.HIGHEST_ID) return +b.id - +a.id;
        if (sortType === sortTypes.LOWEST_ID) return +a.id - b.id;
        if (sortType === sortTypes.HIGHEST_RANK) {
            if (a.rankable && b.rankable) return +b.rank - +a.rank;
        }
        if (sortType === sortTypes.LOWEST_RANK) {
            if (a.rankable && b.rankable) return +a.rank - +b.rank;
        }
        return;
    });
};

export const lootboxesFirst = (items) => {
    let foundersItems = [] as any;
    let lootboxItems = [] as any;
    let _items = [] as any;
    items.map((item) => {
        item.address === lootboxContractAddress
            ? lootboxItems.push(item)
            : foundersItems.push(item);
    });
    _items = [...lootboxItems, ...foundersItems];
    return _items;
};

export const addLootboxMetadata = (results, setSupplies, setIsFetching) => {
    let promises = [] as any;
    let items = [] as any;
    let lootboxes = [] as any;
    results.map((itemArray) => {
        itemArray.map((item) => {
            items.push(item);
            if (item.address === lootboxContractAddress) {
                lootboxes.push(item);
            }
        });
    });

    const lootboxContractCallContext = [
        {
            reference: "lootboxContract",
            contractAddress: lootboxContractAddress,
            abi: LootboxABI,
            calls: lootboxes.map((supply) => {
                return {
                    reference: "getLootboxCall",
                    methodName: "getLootbox",
                    methodParameters: [supply.id ? supply.id : supply.token_id],
                };
            }),
        },
    ];

    promises.push(
        multicall.call(lootboxContractCallContext).then((response) => {
            if (response.results.lootboxContract) {
                response.results.lootboxContract.callsReturnContext.forEach(
                    (ctx, index) => {
                        lootboxes[index].requestID =
                            web3.utils.hexToNumberString(
                                ctx.returnValues[1].hex
                            );
                        lootboxes[index].randomWords = ctx.returnValues[2].map(
                            (x) => {
                                return web3.utils.hexToNumber(x.hex);
                            }
                        );
                        lootboxes[index].claimed = ctx.returnValues[3];

                        LootboxUtilModel.loadLootboxMetadata(lootboxes[index]);
                    }
                );
            }
        })
    );
    Promise.all(promises).then(() => {
        setSupplies(items);
        setIsFetching(false);
    });
};

export const lootboxActions = (
    _item: any,
    isLootboxApprovedToClaim,
    setSelectedItem,
    handleApproveFounderLootbox,
    handleOpenFounderLootbox,
    handleClaimFounderLootbox
) => {
    if (_item.address !== lootboxContractAddress || !_item.status) {
        return undefined;
    }
    const actions = [] as Array<any>;
    const status = LootboxUtilModel.getLootboxStatus(_item);
    if (
        status !== LootboxUtilModel.LOOTBOX_STATUSES.CLAIMED &&
        status !== LootboxUtilModel.LOOTBOX_STATUSES.OPENED &&
        status !== LootboxUtilModel.LOOTBOX_STATUSES.OPENING
    ) {
        actions.push({
            label: "Open",
            callback: (item) => {
                setSelectedItem(item);
                handleOpenFounderLootbox(item);
            },
        });
    } else if (
        status === LootboxUtilModel.LOOTBOX_STATUSES.OPENED &&
        status !== LootboxUtilModel.LOOTBOX_STATUSES.CLAIMED
    ) {
        if (isLootboxApprovedToClaim) {
            actions.push({
                label: "Claim",
                callback: (item) => {
                    handleClaimFounderLootbox(item);
                },
            });
        } else {
            actions.push({
                label: "Approve to Claim",
                callback: (item) => {
                    handleApproveFounderLootbox();
                },
            });
        }
    }

    return actions;
};

export const getPathPrefix = (item) => {
    if (item.address === foundersItemsContractAddress)
        return `/marketplace/${RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_ITEM_URI}`;
    else
        return `/marketplace/${RouteUtilModel.MARKETPLACE_ITEM_FOUNDER_LOOTBOX_URI}`;
};

export const claimFounderLootbox = (
    _item,
    selectedItem,
    claimLootboxRewards,
    setIsSpinBoxOpen,
    refreshItems
) => {
    console.log("claiming item: ", _item);
    if (_item.target) {
        _item = null;
    }
    if (!selectedItem && !_item) {
        return;
    }

    let id;
    if (_item) {
        id = _item.id ? _item.id : _item.token_id;
    } else {
        id = selectedItem.id ? selectedItem.id : selectedItem.token_id;
    }

    claimLootboxRewards({
        lootboxes: [id],
        callback: (receipt) => {
            refreshItems();
            setIsSpinBoxOpen(false);
        },
    });
};

export const openFounderLootbox = (
    _item,
    updateOverlay,
    openLootbox,
    setIsSpinBoxOpen,
    refreshItems
) => {
    console.log("opening item: ", _item);
    if (!_item) {
        return;
    }
    updateOverlay(true);
    openLootbox({
        lootboxes: [_item.id ? _item.id : _item.token_id],
        callback: (receipt) => {
            setIsSpinBoxOpen(true);
            updateOverlay(false);
            refreshItems();
        },
        errorCallback: () => {
            updateOverlay(false);
        },
    });
};

export const checkIfLootboxIsApprovedForClaim = (
    account,
    setIsLootboxApprovedToClaim,
    isLootboxApprovedForClaim
) => {
    if (!account) {
        setIsLootboxApprovedToClaim(false);
        return;
    }
    isLootboxApprovedForClaim({ account }).then((_approved) => {
        setIsLootboxApprovedToClaim(_approved);
    });
};

export const approveFounderLootbox = (
    isLootboxApprovedToClaim,
    setIsLootboxApprovedToClaim,
    approveLootboxForClaim
) => {
    if (!isLootboxApprovedToClaim) {
        approveLootboxForClaim({
            callback: () => {
                setIsLootboxApprovedToClaim(true);
            },
        });
        return;
    }
};
