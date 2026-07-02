import { useEffect, useState } from "react";

import { AbiItem } from "web3-utils";
import Web3 from "web3";
import { activeNodes } from "../../constants/Nodes";
import { blockchains } from "../../constants/Blockchains";
import { isNumber } from "lodash";

// const web3 = new Web3(activeNode);

export const getOwnerOfToken = async (
    collectionAddress: string,
    tokenId: number,
    blockchain?: number
) => {
    const activeNode = activeNodes[blockchain || blockchains.BSC];
    const web3 = new Web3(activeNode);

    const abi = [
        {
            inputs: [
                {
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ownerOf",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
    ];

    const Contract = new web3.eth.Contract(abi as AbiItem[], collectionAddress);
    return Contract.methods.ownerOf(tokenId).call() as Promise<string>;
};

export const useOwnerOfToken = ({
    collectionAddress,
    tokenId,
    blockchain = blockchains.BSC,
}: {
    collectionAddress: string;
    tokenId: number;
    blockchain?: number;
}) => {
    const [owner, setOwner] = useState("");

    useEffect(() => {
        let mounted = true;
        if (collectionAddress && isNumber(tokenId)) {
            getOwnerOfToken(collectionAddress, tokenId, blockchain).then(
                (_owner) => {
                    if (mounted) {
                        setOwner(_owner);
                    }
                }
            );
        }
        return () => {
            mounted = false;
        };
    }, [collectionAddress, tokenId, blockchain]);

    return owner;
};
