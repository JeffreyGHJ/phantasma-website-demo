import { useEffect } from "react";
import axios from "axios";

const souleatersMetdataURI = `https://littleghosts.s3.us-east-2.amazonaws.com/souleaters/metadata/`;

const SETraitFetcher = () => {
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

    const formatSouleatersMetadata = (data) => {
        Object.entries(data).map((entry) => {
            let id = entry[0];
            let attributes = entry[1] as any;
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
                if (attribute.trait_type === "Enhanced" && +id === 216) {
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
            data[id] = attributes;
        });
        // console.log("Formatted data: ", data);
    };

    const fetchData = async (startId, endID) => {
        let results = {};
        for (let id = startId; id <= endID; id++) {
            let result: any = await axios.get(`${souleatersMetdataURI}${id}`);
            results[id] = result.data.attributes;
        }
        return results;
    };

    const fetchMetadataInRange = async (startId, endID, formatData = true) => {
        let data = await fetchData(startId, endID);
        if (formatData) formatSouleatersMetadata(data);
        return data;
    };

    useEffect(() => {
        console.log("FETCHING METADATA");
        fetchMetadataInRange(841, 850, true).then((results) => {
            console.log("results: ", results);
            download(results);
        });
    }, []);

    return <></>;
};

export default SETraitFetcher;
