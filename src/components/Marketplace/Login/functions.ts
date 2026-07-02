import Web3 from "web3";
import User from "../../../constants/types/User";
import WebErrorResponse from "../../../constants/types/WebErrorResponse";
import authErrorReasons from "../../../constants/errorReasons/authErrorReasons";
import { ethers } from "ethers";

export const loginWithWallet = async (
    recaptcha1,
    setRecaptcha1Open,
    enqueueSnackbar,
    library,
    updateOverlay,
    fetchNounceByWalletAddress,
    loginWithWalletAddress,
    updateUser,
    overrideLocalSettings,
    navigate,
    registerWithWalletAddress,
    setNounce,
    setRecaptcha2Open
) => {
    let signer;
    if (!recaptcha1) {
        setRecaptcha1Open(true);
        return;
    }
    /* @ts-ignore */
    if (!window.ethereum && !library) {
        enqueueSnackbar("Web3 provider not found", { variant: "error" });
        return;
    }

    /* @ts-ignore */
    if (window.ethereum) {
        /* @ts-ignore */
        await window.ethereum.request({ method: "eth_requestAccounts" });
        /* @ts-ignore */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    } else {
        signer = library?.getSigner();
    }

    const address = await signer.getAddress();
    if (Web3.utils.isAddress(address)) {
        updateOverlay(true);
        fetchNounceByWalletAddress({ walletAddress: address })
            .then(async (message) => {
                updateOverlay(false);
                const signature = await signer.signMessage(
                    `Sign in \n\n${message}`
                );
                updateOverlay(true);
                loginWithWalletAddress({
                    walletAddress: address,
                    recaptcha: recaptcha1,
                    signature,
                })
                    .then((response) => {
                        const responseData = response.data as {
                            data: User;
                        };
                        updateUser(responseData.data);
                        overrideLocalSettings(responseData.data);
                        updateOverlay(false);
                        navigate("/marketplace/profile/dashboard");
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data;
                            enqueueSnackbar(err.errMsg || "Unknown error", {
                                variant: "error",
                            });
                        } else {
                            console.log(error);
                            enqueueSnackbar("Unknown error", {
                                variant: "error",
                            });
                        }
                        updateOverlay(false);
                    });
            })
            .catch((err) => {
                const errorResponse = err.response.data as WebErrorResponse;
                if (
                    errorResponse.errReason &&
                    errorResponse.errReason ===
                        authErrorReasons.ACCOUNT_NOT_REGISTERRED
                ) {
                    // Handle account not registerred
                    signer.signMessage("Sign up \n\n").then((signature) => {
                        registerWithWalletAddress({
                            walletAddress: address,
                            recaptcha: recaptcha1,
                            signature,
                        })
                            .then(async (nounce) => {
                                setNounce(nounce);
                                setRecaptcha2Open(true);
                            })
                            .catch((error) => {
                                if (error.response) {
                                    const err = error.response.data;
                                    enqueueSnackbar(
                                        err.errMsg || "Unknown error",
                                        {
                                            variant: "error",
                                        }
                                    );
                                } else {
                                    console.log(error);
                                    enqueueSnackbar("Unknown error", {
                                        variant: "error",
                                    });
                                }
                            });
                    });
                } else if (errorResponse.errMsg) {
                    enqueueSnackbar(errorResponse.errMsg, {
                        variant: "error",
                    });
                } else {
                    enqueueSnackbar("Unknown error. Please try again later", {
                        variant: "error",
                    });
                }
                updateOverlay(false);
            });
    } else {
        enqueueSnackbar("Web3 address error", { variant: "error" });
        return;
    }
};

export const signinAfterRegister = async (
    nounce,
    recaptcha2,
    enqueueSnackbar,
    library,
    loginWithWalletAddress,
    updateUser,
    overrideLocalSettings,
    updateOverlay,
    navigate
) => {
    let signer;
    if (!nounce || !recaptcha2) {
        enqueueSnackbar("Invalid nounce or recaptcha provided", {
            variant: "error",
        });
        return;
    }
    /* @ts-ignore */
    if (!window.ethereum && !library) {
        enqueueSnackbar("Web3 provider not found", { variant: "error" });
        return;
    }
    /* @ts-ignore */
    if (window.ethereum) {
        /* @ts-ignore */
        await window.ethereum.request({ method: "eth_requestAccounts" });
        /* @ts-ignore */
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    } else {
        signer = library?.getSigner();
    }
    const address = await signer.getAddress();
    const signature = await signer.signMessage(`Sign in \n\n${nounce}`);
    if (Web3.utils.isAddress(address)) {
        loginWithWalletAddress({
            walletAddress: address,
            recaptcha: recaptcha2,
            signature,
        })
            .then((response) => {
                const responseData = response.data as {
                    data: User;
                };
                updateUser(responseData.data);
                overrideLocalSettings(responseData.data);
                updateOverlay(false);
                navigate("/marketplace/profile/dashboard");
            })
            .catch((err) => {
                const errorResponse = err.response.data as WebErrorResponse;
                if (errorResponse.errMsg) {
                    enqueueSnackbar(errorResponse.errMsg, {
                        variant: "error",
                    });
                } else {
                    enqueueSnackbar("Unknown error. Please try again later", {
                        variant: "error",
                    });
                }
                updateOverlay(false);
            });
    } else {
        enqueueSnackbar("Web3 address error", { variant: "error" });
        return;
    }
};
