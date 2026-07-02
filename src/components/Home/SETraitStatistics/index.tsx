import { useEffect } from "react";
import souleaterTraits from "../../../constants/souleaterTraits.json";

const SETraitStatistics = () => {
    const download = (data) => {
        let jsonData = JSON.stringify(data);
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
            new Blob([jsonData], {
                type: "application/json",
            })
        );
        a.setAttribute("download", "souleaterTraits.json");
        body.appendChild(a);
        a.click();
        body.removeChild(a);
        // console.log(jsonData);
    };

    // use attributes in filters to generate dummy data
    const generateDummyDataFromFilters = (filters) => {
        let id = 0;
        let newNfts = {};
        let traitTypes = Object.keys(filters);

        console.log("Trait Types: ", traitTypes);

        for (id; id < 10000; id++) {
            let itemTraits = [] as any;
            traitTypes.map((traitType) => {
                let traits = Object.keys(filters[traitType]);
                let randomTrait = ~~(Math.random() * (traits.length - 1));
                itemTraits.push({
                    trait_type: traitType,
                    value: traits[randomTrait],
                });
            });
            newNfts[id] = itemTraits;
        }

        console.log(newNfts);
        download(newNfts);
    };

    useEffect(() => {
        let data = Object.values(souleaterTraits);
        let filters = {};
        console.log("Total SoulEaters in file: ", data.length);

        data.map((traitEntries, index) => {
            traitEntries.map((traitEntry) => {
                let traitType = traitEntry.trait_type;
                let traitValue = traitEntry.value;

                // make lowercase
                traitType = traitType.toLowerCase();
                traitValue = traitValue.toLowerCase();

                // create entry for this traitType if not already exist
                if (!filters[traitType]) filters[traitType] = {};
                let traits = filters[traitType];

                // create entry for this traitValue if not already exist
                if (!traits[traitValue]) traits[traitValue] = 0;

                // update the count of the traitValue by 1
                let traitOccurrences = traits[traitValue];
                traits[traitValue] = traitOccurrences + 1;
            });
        });

        console.log(filters);
        // generateDummyDataFromFilters(filters)
        // download(filters)
    }, []);

    return <></>;
};

export default SETraitStatistics;
