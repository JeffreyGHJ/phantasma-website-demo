import React, {createContext, useContext, useEffect, useState} from 'react';
import Web3 from "web3";
import {Account, Connection, Keypair} from '@solana/web3.js';
import {activeNode, solanaNode} from "../constants/Nodes";
import localForage from "localforage";
import CryptoJS from "crypto-js";

const web3Eth = new Web3(activeNode);
const connectionSol = new Connection(solanaNode);


const VaultManagerContext = createContext();

function VaultManagerProvider({ children }) {

    const [web3Account, setWeb3Account] = useState(() => {
        const savedWeb3Account = sessionStorage.getItem('web3Account');
        return savedWeb3Account ? JSON.parse(savedWeb3Account) : null;
    });

    const [solanaAccount, setSolanaAccount] = useState(() => {
        const savedSolanaAccount = sessionStorage.getItem('solanaAccount');
        return savedSolanaAccount ? JSON.parse(savedSolanaAccount) : null;
    });

    const [accounts, setAccounts] = useState(async () => {
        const savedAccounts = await localForage.getItem('accounts');
        return savedAccounts ? JSON.parse(savedAccounts) : {};
    });



    async function initializeSolanaAccount(username, password) {
        try {
            const decryptedPrivateKey = await getKey(username, password, 'sol');
            const privateKeyArray = decryptedPrivateKey.split(',').map(num => Number(num));
            const keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
            setSolanaAccount(keypair);
            sessionStorage.setItem('solanaAccount', JSON.stringify(keypair));
        } catch (error) {
            console.error('Failed to initialize Solana account:', error);
        }
    }

    async function initializeWeb3Account(username, password) {
        try {
            const decryptedPrivateKey = await getKey(username, password, 'eth');
            const privateKeyBuffer = Buffer.from(decryptedPrivateKey, 'hex');
            const account = new Account(privateKeyBuffer);
            setWeb3Account(account);
            sessionStorage.setItem('web3Account', JSON.stringify(account));
        } catch (error) {
            console.error('Failed to initialize Web3 account:', error);
        }
    }


    // Function to encrypt a text using a password
    function encrypt(text, password) {
        const ciphertext = CryptoJS.AES.encrypt(text, password).toString();
        return ciphertext;
    }

    // Function to decrypt a ciphertext using a password
    function decrypt(ciphertext, password) {
        const bytes = CryptoJS.AES.decrypt(ciphertext, password);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
    }



    useEffect(() => {
        if(accounts){
            localForage.setItem('accounts', JSON.stringify(accounts));
        }
    }, [accounts]);

    useEffect(() => {
        window.addEventListener('beforeunload', cleanupSession);
        return () => {
            window.removeEventListener('beforeunload', cleanupSession);
        };
    }, []);

    function cleanupSession() {
        sessionStorage.clear();
    }

    async function create(username, password, privateKeyEth, accountAddressEth, privateKeySol, accountAddressSol) {
        const encryptedKeyEth = encrypt(privateKeyEth, password);
        const encryptedKeySol = encrypt(privateKeySol, password);
        const newAccount = {
            eth: {
                address: accountAddressEth,
                text: encryptedKeyEth,
                nonce: 0
            },
            sol: {
                address: accountAddressSol,
                text: encryptedKeySol
            }
        };
        setAccounts(prevAccounts => ({
            ...prevAccounts,
            [username]: newAccount,
        }));
    }

    async function getKey(username, password, blockchainType) {
        const account = accounts[username];
        if (!account || !account[blockchainType]) {
            throw new Error('Invalid username or blockchain type');
        }
        const decryptedKey = decrypt(account[blockchainType].text, password);

        if (blockchainType === 'eth') {
            const computedAddress = web3Eth.eth.accounts.privateKeyToAccount(decryptedKey).address;
            if (account.eth.address.toLowerCase() === computedAddress.toLowerCase()) {
                return decryptedKey;
            } else {
                throw new Error('Wrong password');
            }
        } else if (blockchainType === 'sol') {
            const keypair = Keypair.fromSecretKey(new Uint8Array([...decryptedKey.split(',').map(num => Number(num))]));
            if (account.sol.address === keypair.publicKey.toString()) {
                return decryptedKey;
            } else {
                throw new Error('Wrong password');
            }
        } else {
            throw new Error('Unsupported blockchain type');
        }
    }

    function getAddress(username, blockchainType) {
        const account = accounts[username];
        return account?.[blockchainType]?.address;
    }

    function getNonce(username) {
        return accounts[username]?.eth?.nonce;
    }

    function setNonce(username, nonce) {
        const updatedAccount = { ...accounts[username], eth: { ...accounts[username].eth, nonce } };
        setAccounts(prevAccounts => ({
            ...prevAccounts,
            [username]: updatedAccount,
        }));
    }

    function getUsernames() {
        return Object.keys(accounts);
    }

    const value = {
        accounts,
        setAccounts,
        create,
        getKey,
        web3Account,
        initializeWeb3Account,
        solanaAccount,
        initializeSolanaAccount,
        getAddress,
        getNonce,
        setNonce,
        getUsernames,
    };

    return (
        <VaultManagerContext.Provider value={value}>
            {children}
        </VaultManagerContext.Provider>
    );
}

export { VaultManagerProvider, VaultManagerContext };

export function useVaultManager() {
    return useContext(VaultManagerContext);
}
