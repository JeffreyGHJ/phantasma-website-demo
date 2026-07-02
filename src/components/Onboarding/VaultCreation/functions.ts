import { ethers } from "ethers";
import * as bip39 from "bip39";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import AccountModel from "../../../models/AccountModel";
import { cloneDeep } from "lodash";
import User from "../../../constants/types/User";

export const confirmWallet = async (
    user,
    updateUser,
    vaultManager,
    mnemonic,
    password,
    setProcessingVault,
    setVaultFinalized,
    enqueueSnackbar
) => {
    // Join the mnemonic words back into a space-separated string
    const mnemonicString = mnemonic.join(" ");

    // For Ethereum:
    const ethWallet = ethers.Wallet.fromMnemonic(mnemonicString);
    const privateKeyEth = ethWallet.privateKey;
    const accountAddressEth = ethWallet.address;

    // For Solana:
    const seed = await bip39.mnemonicToSeed(mnemonicString); // Convert mnemonic to seed
    const keypairFromSeed = nacl.sign.keyPair.fromSeed(
        new Uint8Array(seed.slice(0, 32))
    ); // Generate keypair from seed
    const solanaKeypair = Keypair.fromSecretKey(keypairFromSeed.secretKey);
    const privateKeySol = Array.from(solanaKeypair.secretKey).join(",");
    const accountAddressSol = solanaKeypair.publicKey.toString();

    const messageEth = "Bind EVM vault";
    const evmSignature = await ethWallet.signMessage(messageEth);

    const messageSol = "Bind SOL vault";
    const uint8ArrayMessageSol = new TextEncoder().encode(messageSol); // Convert message to Uint8Array
    const solSignatureUint8Array = nacl.sign.detached(
        uint8ArrayMessageSol,
        solanaKeypair.secretKey
    );
    const base64Signature = Buffer.from(solSignatureUint8Array).toString(
        "base64"
    ); // Convert Uint8Array to Base64 String

    // Enable loading state here
    setProcessingVault(true);
    AccountModel.bindVaultAddresses({
        evmAddress: accountAddressEth,
        solAddress: accountAddressSol,
        evmSignature: evmSignature,
        solSignature: base64Signature,
    })
        .then(async (res) => {
            enqueueSnackbar(
                "Successfully created vault! You have been rewarded the starter box! 🎁",
                { variant: "success" }
            );
            try {
                await vaultManager.create(
                    user?.username,
                    password,
                    privateKeyEth,
                    accountAddressEth,
                    privateKeySol,
                    accountAddressSol
                );
                console.log("Vault created");
                setVaultFinalized(true); // trigger confetti
                let userUpdate = cloneDeep(user as User);
                userUpdate.VaultEVMAddress = accountAddressEth;
                userUpdate.VaultSOLAddress = accountAddressSol;
                updateUser(userUpdate);
                // disable loading state here
                setProcessingVault(false);
            } catch (error) {
                console.error("Error creating vault:", error);
                enqueueSnackbar("Error creating vault. Please try again.", {
                    variant: "error",
                });
                // disable loading state here
                setProcessingVault(false);
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log(error);
                const err = error.response.data;
                enqueueSnackbar(err.errMsg || "Error. Please try again.", {
                    variant: "error",
                });
            } else {
                enqueueSnackbar("Error. Please try again.", {
                    variant: "error",
                });
            }
            // disable loading state here
            setProcessingVault(false);
        });
};
