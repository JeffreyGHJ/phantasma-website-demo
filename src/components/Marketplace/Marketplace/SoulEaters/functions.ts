export const assembleNftItems = (souleaterTraits, souleaterRanks) => {
    let _items = [] as any;
    Object.entries(souleaterTraits).map((entry) => {
        let tokenId = entry[0];
        let traits = entry[1] as any;
        let trait_type_value = {};

        traits.map((traitEntry) => {
            let trait_type = traitEntry.trait_type;
            let value = traitEntry.value;
            trait_type_value[trait_type] = value;
        });

        let item = {
            name: "SoulEaters",
            tokenId: tokenId,
            trait_type_value: trait_type_value,
            rank: souleaterRanks[tokenId]?.rank || null,
            score: souleaterRanks[tokenId]?.score || null,
        };
        _items.push(item);
    });
    // _items.sort((a, b) => a.rank - b.rank);
    // _items.reverse();
    return _items;
};
