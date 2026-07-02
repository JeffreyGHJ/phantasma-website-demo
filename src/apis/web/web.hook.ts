import { useCallback, useEffect, useState } from "react";
import AccountItems from "../../state/application/types/AccountItems";
import { addLootboxMetadata } from "../../components/Marketplace/ProfileLayout/Inventory/Supplies/functions";
import { blockchains } from "../../constants/Blockchains";
import {
    fetchCollectionItemsByAddress,
    fetchSoulEatersByAddress,
    fetchSolanaAssetsByOwner,
    fetchAllOwnedCollectionItems,
} from "./web.api";
import {
    foundersItemsContractAddress,
    lootboxContractAddress,
} from "../../constants/ContractAddresses";
import useAllAccounts from "../../hooks/useAllAccounts";

const BSC = blockchains.BSC as number;

export const useCollectionItemsByAddress = ({
    blockchain,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    address: string;
}) => {
    const [items, setItems] = useState<AccountItems>({
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    });

    useEffect(() => {
        let mounted = true;
        if (!blockchain || !collection || !address) {
            setItems({
                auctionedItems: [],
                listedItems: [],
                offerReceivedItems: [],
                ownedItems: [],
            });

            return () => {};
        }

        fetchCollectionItemsByAddress({
            blockchain,
            collection,
            address,
        }).then((response) => {
            if (mounted) {
                setItems(response.data);
            }
        });

        return () => {
            mounted = false;
        };
    }, [blockchain, collection, address]);

    return items;
};

export const useCollectionItemsAllAccounts = ({ blockchain, collection }) => {
    const allAccounts = useAllAccounts();

    const [items, setItems] = useState<AccountItems>({
        auctionedItems: [],
        listedItems: [],
        offerReceivedItems: [],
        ownedItems: [],
    });

    useEffect(() => {
        let mounted = true;
        if (allAccounts === undefined) return;
        if (!allAccounts.length) {
            setItems({
                auctionedItems: [],
                listedItems: [],
                offerReceivedItems: [],
                ownedItems: [],
            });
            return () => {};
        }

        let promises = [] as any;

        allAccounts.map((address) => {
            promises.push(
                fetchCollectionItemsByAddress({
                    blockchain,
                    collection,
                    address,
                }).then((response: any) => {
                    return response;
                })
            );
        });

        Promise.all(promises).then((results) => {
            let auctioned = [];
            let listed = [];
            let offer = [];
            let owned = [] as any;

            for (let res of results) {
                auctioned = auctioned.concat(res.data.auctionedItems);
                listed = listed.concat(res.data.listedItems);
                offer = offer.concat(res.data.offerReceivedItems);
                owned = owned.concat(res.data.ownedItems);
            }

            let _items = {
                auctionedItems: auctioned,
                listedItems: listed,
                offerReceivedItems: offer,
                ownedItems: owned,
            };

            setItems(_items);
        });

        return () => {
            mounted = false;
        };
    }, [blockchain, collection, allAccounts]);

    return items;
};

// temporary variation of useCollectionItemsByAddress
// useful until SoulEaters metadata is normalized in our DB
export const useSoulEatersByAddress = ({ address }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let mounted = true;
        if (!address) {
            setItems([]);
            return () => {};
        }

        fetchSoulEatersByAddress({
            address,
        }).then((response) => {
            if (mounted) {
                setItems(response);
            }
        });

        return () => {
            mounted = false;
        };
    }, [address]);

    return items;
};

// similar to useSoulEatersByAddress but with all user accounts
export const useSoulEatersAllAccounts = () => {
    const allAccounts = useAllAccounts();
    const [souleaters, setSouleaters] = useState([] as any);

    useEffect(() => {
        if (allAccounts === undefined) return;
        if (!allAccounts.length) {
            setSouleaters([]);
            return;
        }

        let promises = [] as any;

        allAccounts.map((address) => {
            promises.push(
                fetchSoulEatersByAddress({ address }).then((response: any) => {
                    return response;
                })
            );
        });

        Promise.all(promises).then((results) => {
            let items = [] as any;
            results.map((data) => {
                data.map((item) => {
                    items.push(item);
                });
            });
            setSouleaters(items);
        });

        return () => {};
    }, [allAccounts]);

    return souleaters;
};

export const useSolanaAssetsByOwner = ({
    ownerAddress,
    page = 1,
    limit = 1000,
}) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let mounted = true;
        if (!ownerAddress) {
            setItems([]);
            return () => {};
        }

        fetchSolanaAssetsByOwner({
            ownerAddress,
            page,
            limit,
        }).then((response) => {
            if (mounted) {
                setItems(response);
            }
        });

        return () => {
            mounted = false;
        };
    }, [ownerAddress]);

    return items;
};

// Generic, use for all other tabs except supplies
export const useAllOwnedCollectionItems = (
    blockchain,
    accounts,
    collection,
    refresh?,
    setIsFetching?
) => {
    const [items, setItems] = useState([] as any);

    useEffect(() => {
        if (!accounts.length || !collection || !blockchain) {
            setItems([]);
            if (setIsFetching) setIsFetching(false);
            return;
        }

        if (setIsFetching) setIsFetching(true);

        let promises = [] as any;

        accounts.map((address) => {
            promises.push(
                fetchAllOwnedCollectionItems({
                    blockchain,
                    address,
                    collection,
                }).then((response: any) => {
                    return response.data;
                })
            );
        });

        Promise.all(promises).then((results) => {
            let items = [] as any;
            results.map((itemArray) => {
                itemArray.map((item) => {
                    items.push(item);
                });
            });
            setItems(items);
            if (setIsFetching) setIsFetching(false);
        });

        return () => {};
    }, [accounts, collection, blockchain, refresh, setIsFetching]);

    return items;
};

// used specifically for vault supply tab
export const useAllOwnedSupplies = () => {
    const allAccounts = useAllAccounts();
    const [supplies, setSupplies] = useState([] as any);
    const [refresh, setRefresh] = useState(0);
    const [isFetching, setIsFetching] = useState(true);

    const refreshSupplies = useCallback(() => {
        refresh ? setRefresh(0) : setRefresh(1);
    }, [refresh]);

    useEffect(() => {
        if (allAccounts === undefined) return;
        if (!allAccounts.length) {
            setSupplies([]);
            setIsFetching(false);
            return;
        }

        setIsFetching(true);

        let promises = [] as any;

        allAccounts.map((address) => {
            promises.push(
                fetchAllOwnedCollectionItems({
                    blockchain: BSC,
                    address,
                    collection: foundersItemsContractAddress,
                }).then((response: any) => {
                    return response.data;
                })
            );

            promises.push(
                fetchAllOwnedCollectionItems({
                    blockchain: BSC,
                    address,
                    collection: lootboxContractAddress,
                }).then((response: any) => {
                    return response.data;
                })
            );
        });

        Promise.all(promises).then((results) => {
            addLootboxMetadata(results, setSupplies, setIsFetching);
        });

        return () => {};
    }, [allAccounts, refresh, setIsFetching]);

    return {
        supplies,
        refreshSupplies,
        isFetching,
    };
};
