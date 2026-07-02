const SORTINGS = {
    FEATURED: "Featured",
    NEW: "New",
    OLD: "Old",
    PRICE_HIGH_LOW: "Price: High to Low",
    PRICE_LOW_HIGH: "Price: Low to High",
};

const calculateEmptyItems = (width, numItems, setEmptyItems) => {
    let minItems = 0;
    let rowSize = 0;

    if (width < 1151) {
        minItems = 4;
    } else if (width < 1451) {
        minItems = 6;
    } else if (width < 1701) {
        minItems = 8;
    } else if (width < 1951) {
        minItems = 10;
    } else {
        minItems = 12;
    }

    rowSize = minItems / 2;

    if (numItems < minItems) {
        setEmptyItems(minItems - numItems);
    } else {
        let remainder = numItems % rowSize;
        remainder > 0 ? setEmptyItems(rowSize - remainder) : setEmptyItems(0);
    }
};

export const filterAndSortItems = (
    shopItems,
    selectedItemType,
    sortBy,
    subFilter,
    setItemsToShow,
    width,
    setEmptyItems,
    currencies,
    SUPPORTED_CURRENCIES
) => {
    let itemsToShow = shopItems;

    // STEP 1: Filter out items by selected type
    if (selectedItemType !== "All") {
        itemsToShow = shopItems.filter(
            (item) => item.item_type === selectedItemType
        );
    }

    // STEP 2: Filter out items by sub filter
    if (subFilter !== "All") {
        if (selectedItemType === "All") {
            itemsToShow = itemsToShow.filter((item) => {
                return item.collection === subFilter;
            });
        } else {
            itemsToShow = itemsToShow.filter((item) => {
                return item.item_sub_type === subFilter;
            });
        }
    }

    // STEP 3: Filter out items by currency type
    if (currencies.length < SUPPORTED_CURRENCIES.length) {
        itemsToShow = itemsToShow.filter((item) => {
            for (let currency of currencies) {
                if (item[currency.toLowerCase()]) return item;
            }
        });
    }

    // STEP 4: Sort items using selected sortBy
    if (sortBy === SORTINGS.FEATURED) {
        itemsToShow.sort((a, b) => {
            if (a.featured && b.featured) return 0;
            if (!a.featured && !b.featured) return 0;
            if (a.featured) return -1;
            else return 1;
        });
    } else if (sortBy === SORTINGS.NEW || sortBy === SORTINGS.OLD) {
        itemsToShow.sort((a, b) =>
            a.date_created.localeCompare(b.date_created)
        );
        if (sortBy === SORTINGS.OLD) itemsToShow.reverse();
    } else if (
        sortBy === SORTINGS.PRICE_HIGH_LOW ||
        sortBy === SORTINGS.PRICE_LOW_HIGH
    ) {
        let res = [];
        let temp = [];

        if (currencies.includes("ECTO")) {
            // filter out all items that have ecto, put them in a buffer
            temp = itemsToShow.filter((item) =>
                item.ecto !== undefined ? item : null
            );
            // sort buffer by ECTO
            sortBy === SORTINGS.PRICE_LOW_HIGH
                ? temp.sort((a: any, b: any) => +a.ecto - +b.ecto)
                : temp.sort((a: any, b: any) => +b.ecto - +a.ecto);
            // concat with result
            res = [...res, ...temp];
        }

        if (currencies.includes("MATIC")) {
            // filter out all items that have matic, put them in a buffer
            temp = itemsToShow.filter((item) =>
                item.matic !== undefined ? item : null
            );
            // remove any items from temp that are already in the result
            temp = temp.filter((item) => (res.includes(item) ? null : item));
            // sort buffer by MATIC
            sortBy === SORTINGS.PRICE_LOW_HIGH
                ? temp.sort((a: any, b: any) => +a.matic - +b.matic)
                : temp.sort((a: any, b: any) => +b.matic - +a.matic);
            // concat with result
            res = [...res, ...temp];
        }

        if (currencies.includes("BNB")) {
            // filter out all items that have bnb, put them in a buffer
            temp = itemsToShow.filter((item) =>
                item.bnb !== undefined ? item : null
            );
            // remove any items from temp that are already in the result
            temp = temp.filter((item) => (res.includes(item) ? null : item));
            // sort buffer by BNB
            sortBy === SORTINGS.PRICE_LOW_HIGH
                ? temp.sort((a: any, b: any) => +a.bnb - +b.bnb)
                : temp.sort((a: any, b: any) => +b.bnb - +a.bnb);
            /// concat with result
            res = [...res, ...temp];
        }

        itemsToShow = res;
    }

    // STEP 5: determine how many empty item boxes to add based on width
    calculateEmptyItems(width, itemsToShow.length, setEmptyItems);

    // STEP 6: Set final items to show
    setItemsToShow(itemsToShow);
};
