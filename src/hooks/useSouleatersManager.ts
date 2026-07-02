import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import Web3 from "web3";
import { activeNodes } from "../constants/Nodes";
import { ERC20_ABI } from "../constants/abis/erc20";
import { AbiItem } from "web3-utils";
import { souleatersContractAddress } from "../constants/ContractAddresses";
import { blockchains } from "../constants/Blockchains";
import souleaterTraits from "../constants/souleaterTraits.json";
import souleaterRanks from "../constants/souleaterRanks.json";
import {
    fetchMetadataByIds,
    flattenTraits,
} from "../components/Home/functions";
import { fetchCollectionRanks } from "../apis/web/web.api";
import { cloneDeep } from "lodash";

import { useSouleaters, useUpdateSoulEaters } from "../state/application/hooks";
import { assembleNftItems } from "../components/Marketplace/Marketplace/SoulEaters/functions";

const activeNode = activeNodes[blockchains.POLYGON];
const web3 = new Web3(activeNode);

const useSouleatersManager = (autoUpdate = true) => {
    const { enqueueSnackbar } = useSnackbar();
    const setStoredSoulEaters = useUpdateSoulEaters(); // set in redux
    const storedSoulEaters = useSouleaters(); // get from redux

    // variables that auto control when traits need to be fetched
    const [totalSupply, setTotalSupply] = useState(null);
    const [numInFile, setNumInFile] = useState<any>(null);
    const [newTraitData, setNewTraitData] = useState(null);

    // hook returns these states to caller
    const [isDataMissing, setIsDataMissing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [soulEaters, setSoulEaters] = useState(
        assembleNftItems(souleaterTraits, souleaterRanks)
    );

    // use this function to trigger updates if set autoUpdate to false
    const updateMetadata = () => {
        setIsUpdating(true);
    };

    const getTotalSupply = async () => {
        const Contract = new web3.eth.Contract(
            ERC20_ABI as AbiItem[],
            souleatersContractAddress
        );

        await Contract.methods
            .totalSupply()
            .call()
            .then((result) => {
                setTotalSupply(result);
            });
    };

    // set num souleaters minted & num in traits file
    useEffect(() => {
        let _soulEaters =
            storedSoulEaters.length > 0
                ? storedSoulEaters
                : assembleNftItems(souleaterTraits, souleaterRanks);
        setSoulEaters(_soulEaters);
        getTotalSupply();
        setNumInFile(Object.keys(_soulEaters).length);
    }, []);

    // if values are not equal then metadata is missing from traits file
    useEffect(() => {
        if (!totalSupply || !numInFile) return;
        console.log("num SE in file: ", +numInFile);
        console.log("total SE mints: ", +totalSupply);
        setIsDataMissing(+totalSupply !== +numInFile);
    }, [totalSupply, numInFile]);

    // fetch traits for missing ids in order
    useEffect(() => {
        if (!isDataMissing || !totalSupply || !numInFile) return;
        if (!isUpdating && !autoUpdate) return;
        if (+totalSupply === +numInFile) return;
        console.log("# of missing SEs: ", totalSupply - numInFile);

        fetchMetadataByIds(numInFile, totalSupply - 1, setNewTraitData);
    }, [isDataMissing, totalSupply, numInFile, isUpdating, autoUpdate]);

    // update collection metadata with new traits, request & attach new ranks
    useEffect(() => {
        if (!newTraitData) return;
        console.log("new trait data: ", newTraitData);

        // deep copy souleaterTraits.json and append new traits
        let traits = cloneDeep(souleaterTraits);
        Object.entries(newTraitData).map((entry) => {
            let key = entry[0];
            let value = entry[1];
            traits[key] = value;
        });

        // try fetching new ranks then assemble collection items
        let ranks = null as any;
        let payload = flattenTraits(traits);

        fetchCollectionRanks(payload)
            .then((results: any) => {
                ranks = results;
                // download(results)
                console.log("SoulEaters data updated.");
                // enqueueSnackbar("SoulEaters data updated.", {
                //     variant: "info",
                //     autoHideDuration: 1500,
                // });
            })
            .catch((err) => {
                console.error(err.message || err);
            })
            .finally(() => {
                // if ranks could not be successfully fetched its still okay
                ranks = ranks ? ranks : souleaterRanks;
                setSoulEaters(assembleNftItems(traits, ranks));
                setIsDataMissing(false);
                setIsUpdating(false);
                setNewTraitData(null);
            });
    }, [newTraitData]);

    useEffect(() => {
        // Put Souleaters in redux
        setStoredSoulEaters(soulEaters);
    }, [soulEaters]);

    const download = (data) => {
        let jsonData = JSON.stringify(data);
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
            new Blob([jsonData], {
                type: "application/json",
            })
        );
        a.setAttribute("download", "souleaterRanks.json");
        body.appendChild(a);
        a.click();
        body.removeChild(a);
        // console.log(jsonData);
    };

    return {
        soulEaters,
        isDataMissing,
        updateMetadata,
        isUpdating,
        autoUpdate,
    };
};

export default useSouleatersManager;
