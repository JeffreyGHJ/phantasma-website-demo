import axios, { AxiosResponse } from "axios";

import AccountItems from "../../state/application/types/AccountItems";
import CollectionItem from "../../state/application/types/CollectionItem";
import CommunityCollection from "../../state/community/types/CommunityCollection";
import { GenericMetadata } from "../../constants/types/GenericMetadata";
import LootboxSingleItem from "../../models/util_models/LootboxUtilModel/types/LootboxSingleItem";
import RecentlySoldCollectionItem from "../../state/application/types/RecentlySoldCollectionItem";
import { SingleCollectionItem } from "../../state/application/types/SingleCollectionItem";
import Swap from "../../components/NftBridge/types/Swap";
import User from "../../constants/types/User";
import WebSettingModel from "../../models/WebSettingModel";

export const fetchCollectionItems = async ({
    blockchain,
    params,
    marketplace,
    collection,
}: {
    blockchain: number;
    params: any;
    marketplace: string;
    collection: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/${marketplace}/collections/${collection}/items`,
        { params, withCredentials: true }
    );
    return res.data as {
        data: CollectionItem;
        pages: number;
        total_rows: number;
    };
};

export const fetchRecentlySoldCollectionItems = async ({
    blockchain,
    params,
    marketplace,
    collection,
}: {
    blockchain: number;
    params: any;
    marketplace: string;
    collection: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/${marketplace}/collections/${collection}/recentlySold`,
        { params }
    );
    return res.data as {
        data: Array<RecentlySoldCollectionItem>;
        pages: number;
        total_rows: number;
    };
};

export const fetchReceivedOffers = async ({
    blockchain,
    params,
    marketplace,
    collection,
    ownerAddress,
}: {
    blockchain: number;
    params: any;
    marketplace: string;
    collection: string;
    ownerAddress: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/${marketplace}/collections/${collection}/receivedOffersByAddress/${ownerAddress}`,
        { params }
    );
    return res.data as {
        data: CollectionItem;
        pages: number;
        total_rows: number;
    };
};

// gets all nfts owned in a collection with traits attached
export const fetchAllOwnedCollectionItems = async ({
    blockchain,
    address,
    collection,
}: {
    blockchain: number;
    address: string;
    collection: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/owned/${address}`
    );
    return res.data;
};

// gets nfts owned with auction and listing data but no traits
export const fetchCollectionItemsByAddress = async ({
    blockchain,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    address: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/itemsbyaddress/${address}`
    );
    return res.data as {
        data: AccountItems;
    };
};

export const fetchSoulEatersByAddress = async ({ address }) => {
    const res = await axios.get(
        `https://api.ghostswap.finance/api/collection/account/${address}/souleaters/assets/all`
    );
    return res.data as any;
};

export const fetchCollectionItemsByIds = async ({
    blockchain,
    collection,
    ids,
}: {
    blockchain: number;
    collection: string;
    ids: Array<number>;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/itemsbyids`,
        {
            params: {
                ids,
            },
        }
    );
    return res.data;
};

export const fetchCollectionitem = async ({
    blockchain,
    collection,
    id,
}: {
    blockchain: number;
    collection: string;
    id: number;
}) => {
    return axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/items/${id}`
    ) as Promise<AxiosResponse<SingleCollectionItem | LootboxSingleItem, any>>;
};

export const fetchSwapsBySender = async ({ sender }: { sender: string }) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftbridge/swapsBySender/${sender}`
    );
    return res.data as Array<Swap>;
};

export const fetchFilters = async ({
    blockchain,
    address,
}: {
    blockchain: number;
    address: string;
}) => {
    return axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${address}/filters`
    );
};

export const fetchCreatedTokenOffers = async ({
    blockchain,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    address: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/createdTokenOffersByAddress/${address}`
    );

    return res.data;
};

export const fetchCreatedTokenOffersWithFilters = async ({
    blockchain,
    params,
    marketplace,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    marketplace: string;
    address: string;
    params: any;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/${marketplace}/collections/${collection}/createdTokenOffersByAddressWithFilters/${address}`,
        { params }
    );

    return res.data;
};

export const fetchCreatedNftOffersWithFilters = async ({
    blockchain,
    params,
    marketplace,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    marketplace: string;
    address: string;
    params: any;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/${marketplace}/collections/${collection}/createdNftOffersByAddressWithFilters/${address}`,
        { params }
    );

    return res.data;
};

export const fetchCreatedNftOffers = async ({
    blockchain,
    collection,
    address,
}: {
    blockchain: number;
    collection: string;
    address: string;
}) => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/nftmarketplace/${blockchain}/collections/${collection}/createdNftOffersByAddress/${address}`
    );

    return res.data;
};

export const syncOffers = async (collection: string, id: number | string) => {
    axios
        .post(
            `${process.env.REACT_APP_API}/nftmarketplace/collections/${collection}/items/${id}/syncOffers`
        )
        .then((res) => {
            console.log("synced");
        });
};

export const fetchCommunityCollections = async () => {
    const res = await axios.get(
        `${process.env.REACT_APP_API}/community/collections`
    );

    return res.data as Array<CommunityCollection>;
};

export const fetchMetadata = async (url: string) => {
    const res = await axios.get(`${process.env.REACT_APP_API}/metadata`, {
        params: {
            url,
        },
    });

    return res.data as GenericMetadata;
};

export const register = async ({
    username,
    email,
    password,
    password_confirmation,
    recaptcha,
    recaptchaType,
}: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    recaptcha: string;
    recaptchaType: string;
}) => {
    return axios.post(`${process.env.REACT_APP_API}/auth/register`, {
        username,
        email,
        password,
        password_confirmation,
        recaptcha,
        recaptcha_type: recaptchaType,
        settings: WebSettingModel.currentLocalSettings(),
    });
};

export const login = async ({
    credential,
    password,
    recaptcha,
    recaptchaType,
    remember_me,
}: {
    credential: string;
    password: string;
    recaptcha: string;
    recaptchaType: string;
    remember_me: boolean;
}) => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/login`,
        {
            credential,
            password,
            recaptcha,
            recaptcha_type: recaptchaType,
            remember_me,
        },
        {
            withCredentials: true,
        }
    );
};

export const activate = async ({ token }: { token: string }) => {
    return axios.post(`${process.env.REACT_APP_API}/auth/activate`, {
        token,
    });
};

export const confirmEmailUpdateRequest = async ({
    token,
}: {
    token: string;
}) => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/confirmEmailUpdateRequest`,
        {
            token,
        }
    );
};

export const fetchUserEmailByPasswordResetToken = async ({
    token,
}: {
    token: string;
}) => {
    return axios.get(`${process.env.REACT_APP_API}/auth/email/${token}`);
};

export const sendForgetPasswordEmail = async ({
    email,
    recaptcha,
}: {
    email: string;
    recaptcha: string;
}) => {
    return axios.post(`${process.env.REACT_APP_API}/auth/forgotPassword`, {
        email,
        recaptcha,
    });
};

export const sendEmailVerification = async ({
    email,
    recaptcha,
}: {
    email: string;
    recaptcha: string;
}) => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/sendEmailVerification`,
        {
            email,
            recaptcha,
        }
    );
};

export const resetPassowrd = async ({
    token,
    email,
    recaptcha,
    password,
    password_confirmation,
}: {
    token: string;
    email: string;
    recaptcha: string;
    password;
    password_confirmation;
}) => {
    return axios.post(`${process.env.REACT_APP_API}/auth/resetPassword`, {
        token,
        email,
        recaptcha,
        password,
        password_confirmation,
    });
};

export const fetchNounceByWalletAddress = async ({
    walletAddress,
}: {
    walletAddress: string;
}) => {
    return axios
        .get(`${process.env.REACT_APP_API}/auth/nounce/${walletAddress}`)
        .then((res) => {
            const response = res.data as {
                data: {
                    nounce: string;
                };
            };
            return response.data.nounce;
        });
};

export const registerWithWalletAddress = async ({
    walletAddress,
    recaptcha,
    signature,
}: {
    walletAddress: string;
    recaptcha: string;
    signature: string;
}) => {
    return axios
        .post(`${process.env.REACT_APP_API}/auth/registerWithWalletAddress`, {
            walletAddress,
            recaptcha,
            signature,
            settings: WebSettingModel.currentLocalSettings(),
        })
        .then((res) => {
            const response = res.data as {
                data: {
                    nounce: string;
                };
            };
            return response.data.nounce;
        });
};

export const loginWithWalletAddress = async ({
    walletAddress,
    recaptcha,
    signature,
}: {
    walletAddress: string;
    recaptcha: string;
    signature: string;
}) => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/loginWithWalletAddress`,
        {
            walletAddress,
            recaptcha,
            signature,
        },
        {
            withCredentials: true,
        }
    );
};

export const updateUsername = async ({
    username,
    recaptcha,
    recaptchaType,
}: {
    username: string;
    recaptcha: string;
    recaptchaType: string;
}) => {
    return axios
        .post(
            `${process.env.REACT_APP_API}/auth/updateUsername`,
            {
                username,
                recaptcha,
                recaptcha_type: recaptchaType,
            },
            {
                withCredentials: true,
            }
        )
        .then((res) => {
            const response = res.data as {
                data: {
                    username: string;
                };
            };

            return response.data.username;
        });
};

export const updatePassword = async ({
    currentPassword,
    password,
    passwordConfirmation,
    recaptcha,
}: {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
    recaptcha: string;
}) => {
    return axios
        .post(
            `${process.env.REACT_APP_API}/auth/updatePassword`,
            {
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
                recaptcha,
            },
            {
                withCredentials: true,
            }
        )
        .then((res) => {
            const response = res.data as {
                data: User;
            };

            return response.data;
        });
};

export const updateEmail = async ({
    currentEmail,
    newEmail,
    emailConfirmation,
    recaptcha,
    recaptchaType,
}: {
    currentEmail: string;
    newEmail: string;
    emailConfirmation: string;
    recaptcha: string;
    recaptchaType: string;
}) => {
    return axios
        .post(
            `${process.env.REACT_APP_API}/auth/updateEmail`,
            {
                current_email: currentEmail,
                new_email: newEmail,
                email_confirmation: emailConfirmation,
                recaptcha,
                recaptcha_type: recaptchaType,
            },
            {
                withCredentials: true,
            }
        )
        .then((res) => {
            const response = res.data as {
                data: User;
                msg: string;
            };

            return response;
        });
};

export const updateUserPreference = async ({
    settingID,
    settingValue,
    recaptcha,
    recaptchaType,
}: {
    settingID: number;
    settingValue: string | number;
    recaptcha: string;
    recaptchaType: string;
}) => {
    return axios
        .put(
            `${process.env.REACT_APP_API}/auth/updateUserPreference`,
            {
                setting_id: settingID,
                setting_value: settingValue,
                recaptcha,
                recaptcha_type: recaptchaType,
            },
            {
                withCredentials: true,
            }
        )
        .then((res) => {
            const response = res.data as {
                data: User;
            };

            return response.data;
        });
};

export const mergeAccount = async ({
    walletAddress,
    recaptcha,
    signature,
}: {
    walletAddress: string;
    recaptcha: string;
    signature: string;
}) => {
    return axios
        .post(
            `${process.env.REACT_APP_API}/auth/mergeAccount`,
            {
                walletAddress,
                recaptcha,
                signature,
            },
            {
                withCredentials: true,
            }
        )
        .then((res) => {
            const response = res.data as {
                data: User;
            };

            return response.data;
        });
};

export const autoLogin = async () => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/autoLogin`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const logout = async () => {
    return axios.post(
        `${process.env.REACT_APP_API}/auth/logout`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const confirmPassword = async ({
    credential,
    password,
    recaptcha,
    recaptchaType,
}: {
    credential: string;
    password: string;
    recaptcha: string;
    recaptchaType: string;
}) => {
    return axios
        .post(`${process.env.REACT_APP_API}/auth/confirmPassword`, {
            credential,
            password,
            recaptcha,
            recaptcha_type: recaptchaType,
        })
        .then((res) => {
            const response = res.data;
            return response;
        });
};

export const fetchSolanaAssetsByOwner = async ({
    ownerAddress,
    page,
    limit,
}: {
    ownerAddress: string;
    page: number;
    limit: number;
}) => {
    return axios
        .get(
            `${process.env.REACT_APP_API}/solana/getAssetsByOwner/${ownerAddress}/${page}/${limit}`
        )
        .then((res) => {
            // console.log(res);
            const response = res.data;
            return response as any;
        });
};

export const getVaultEVMAddressByUsername = async ({
    username,
}: {
    username: string;
}) => {
    return axios
        .get(
            `${process.env.REACT_APP_API}/auth/getVaultEVMAddressByUsername/${username}`
        )
        .then((res) => {
            const response = res.data;
            console.log("response", response);
            return response;
        });
};

export const fetchCollectionRanks = async (collectionData) => {
    // console.log(collectionData);
    return axios
        .post(`${process.env.REACT_APP_API}/nftmarketplace/ranks`, {
            data: collectionData,
        })
        .then((res) => {
            const response = res.data;
            console.log("response", response);
            return response;
        })
        .catch((err) => {
            throw new Error(err.response?.data || err.message || err);
        });
};
