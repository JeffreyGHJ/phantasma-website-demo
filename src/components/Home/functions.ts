import axios from "axios";

const SEMetadataEndpoint =
    "https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/metadata/";

// used for souleaters metadata
// recurvsively calls itself until maxId is reached
// results will be ordered by Id ASC
export const fetchMetadataByIds = async (
    id,
    maxId,
    setNewTraitData,
    results = {}
) => {
    await axios.get(`${SEMetadataEndpoint}${id}`).then((r: any) => {
        let attributes = r.data.attributes;
        let traitTypes = [] as Array<string>;

        // loop over all attributes and edit accordingly
        attributes.map((attribute) => {
            // record all trait types that we find
            traitTypes.push(attribute.trait_type);

            // handle body attribute - split into 3 traits
            if (attribute.trait_type === "Body") {
                let traits = attribute.value.split(" ");

                // set body to traits[0]
                attribute.value = traits[0];

                // set face color to traits[1] or traits[0]
                attributes.push({
                    trait_type: "Face Color",
                    value: traits.length === 3 ? traits[1] : traits[0],
                });

                //set face to traits[2] or traits[0]
                attributes.push({
                    trait_type: "Face",
                    value: traits.length === 3 ? traits[2] : traits[0],
                });
            }

            // handle sometimes background is plural in results
            if (attribute.trait_type === "Backgrounds")
                attribute.trait_type = "Background";

            // handle special case id 216
            if (attribute.trait_type === "Enhanced" && id === 216) {
                attribute.value = "False";
            }
        });

        // handle enhanced trait type was not recorded
        if (!traitTypes.includes("Enhanced"))
            attributes.push({
                trait_type: "Enhanced",
                value: "False",
            });

        // map attributes into results using current tokenId as key
        results[id] = attributes;
        let nextId = id + 1;

        // perform recursion or return results if base case reached
        nextId <= maxId
            ? fetchMetadataByIds(nextId, maxId, setNewTraitData, results)
            : setNewTraitData(results);
    });
};

// reduce plaintext:
// before: {"trait_type": "Background", "value": "red"}
// after:  {"Background": "Red"}
export const flattenTraits = (traitsObject) => {
    let data = Object.values(traitsObject);
    let flattenedTraits = {};
    console.log("Total SoulEaters in file: ", data.length);

    data.map((traitEntries: any, _index) => {
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
    // console.log(flattenedTraits);
    return flattenedTraits;
};

export const downloadDataAsJson = (data) => {
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
