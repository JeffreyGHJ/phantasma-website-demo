import { useEffect } from "react";
import souleaterTraits from "../../../constants/souleaterTraits.json";

const SETraitFlatten = () => {
    const download = (data) => {
        let jsonData = JSON.stringify(data);
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
            new Blob([jsonData], {
                type: "application/json",
            })
        );
        a.setAttribute("download", "souleaterTraitsFlat.json");
        body.appendChild(a);
        a.click();
        body.removeChild(a);
        // console.log(jsonData);
    };

    useEffect(() => {
        let data = Object.values(souleaterTraits);
        let flattenedTraits = {};
        console.log("Total SoulEaters in file: ", data.length);

        data.map((traitEntries, _index) => {
            // console.log(traitEntries)
            let traits_flat = {};

            traitEntries.map((traitEntry, index) => {
                let traitType = traitEntry.trait_type;
                let traitValue = traitEntry.value;

                // make lowercase
                traitType = traitType.toLowerCase();
                traitValue = traitValue.toLowerCase();

                traits_flat[traitType] = traitValue;
            });

            flattenedTraits[_index] = traits_flat;
        });

        console.log(flattenedTraits);
        download(flattenedTraits);
    }, []);

    return <></>;
};

export default SETraitFlatten;
