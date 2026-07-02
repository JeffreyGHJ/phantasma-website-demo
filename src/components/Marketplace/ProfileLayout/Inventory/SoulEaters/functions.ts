import { sortTypes } from "../../../constants/sortTypes";
import souleaterTraits from "../../../../../constants/souleaterTraits.json";
import souleaterRanks from "../../../../../constants/souleaterRanks.json";
import axios from "axios";

const fetchAndAppendTraits = async (item) => {
    await axios
        .get(
            `https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/metadata/${item.tokenId}`
        )
        .then((r: any) => {
            r.data.attributes.map((trait) => {
                let trait_type = trait.trait_type;
                let value = trait.value;

                // sometimes the metdata has 'Backgrounds' plural
                if (trait_type === "Backgrounds") trait_type = "Background";

                item.trait_type_value[trait_type] = value;
            });

            // console.log(
            //     `added missing traits to SoulEaters #${item.tokenId}`,
            //     item.trait_type_value
            // );
        })
        .catch((err) => {
            console.log(
                `Error fetching traits for SoulEaters ${item.tokenId}: `,
                err
            );
        });
};

// first iteration: pull any SE from file, fetch rest, ranks not updated
export const getSEMetadataFromFile = (items) => {
    let _items = [] as any;

    items.map((obj) => {
        let item = { ...obj };
        let traitsMetadata = souleaterTraits[item.tokenId];

        item.rank = souleaterRanks[item.tokenId].rank;
        item.trait_type_value = {};

        // Handle recently minted items whose metadata we don't know
        if (!traitsMetadata) {
            fetchAndAppendTraits(item);
            _items.push(item);
            return;
        }

        traitsMetadata.map((trait) => {
            let trait_type = trait.trait_type;
            let value = trait.value;
            item.trait_type_value[trait_type] = value;
        });

        _items.push(item);
    });

    console.log("old done");
    return _items;
};

// second iteration: uses metadata from redux which auto updates any missing
// mints and recalculates ranks across the entire collection
export const getSEMetadataFromRedux = (accountSoulEaters, allSoulEaters) => {
    let _items = accountSoulEaters.map((souleater) => {
        let rank = allSoulEaters[souleater.tokenId].rank;
        let traits = allSoulEaters[souleater.tokenId].trait_type_value;
        let item = {
            ...souleater,
            trait_type_value: traits,
            rank: rank,
        };
        return item;
    });
    console.log("new done");
    return _items;
};

export const filterItems = (items, activeFilters) => {
    let results = [] as any;

    items.map((item) => {
        if (!matchesFilters(item, activeFilters)) return;
        results.push(item);
    });

    // console.log(results);
    return results;
};

export const matchesFilters = (item, activeFilters) => {
    for (let entry of Object.entries(item.trait_type_value)) {
        let traitType = entry[0];
        let trait = entry[1] as string;

        if (!activeFilters[traitType]) continue;

        let traitsInFilter = Object.entries(activeFilters[traitType]);
        let selectedTraits = [] as any;

        traitsInFilter.map((entry) => {
            let trait = entry[0];
            let values = entry[1] as any;
            if (values.selected === true) selectedTraits.push(trait);
        });

        // item passes filters in this category
        if (selectedTraits.length === 0 || selectedTraits.includes(trait))
            continue;

        // item does not pass and should not go into results
        return false;
    }
    return true;
};

export const sortItems = (items, sortType) => {
    let _items = [] as any;

    // deep copies
    items.map((item) => {
        _items.push(item);
    });

    _items.sort((a, b) => {
        if (sortType === sortTypes.HIGHEST_ID) return +b.tokenId - +a.tokenId;
        if (sortType === sortTypes.LOWEST_ID) return +a.tokenId - b.tokenId;
        if (sortType === sortTypes.HIGHEST_RANK) {
            if (a.rank && b.rank) return +a.rank - +b.rank;
        }
        if (sortType === sortTypes.LOWEST_RANK) {
            if (a.rank && b.rank) return +b.rank - +a.rank;
        }
        return;
    });

    return _items;
};

export const buildFilters = (items) => {
    let filters = {};

    // console.log(items);

    items.map((item) => {
        // console.log(item);
        let traitEntries = Object.entries(item.trait_type_value);

        traitEntries.map((traitEntry) => {
            let traitType = traitEntry[0];
            let traitValue = traitEntry[1];

            // create entry for this traitType if not already exist
            if (!filters[traitType]) filters[traitType] = {};
            let traits = filters[traitType];

            // create entry for this traitValue if not already exist
            if (!traits[traitValue])
                traits[traitValue] = {
                    selected: false,
                    count: 0,
                };

            // update the count of the traitValue by 1
            let traitOccurrences = traits[traitValue].count;
            traits[traitValue].count = traitOccurrences + 1;
        });
    });

    return filters;
};
