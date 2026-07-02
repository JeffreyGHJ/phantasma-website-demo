import "./index.scss";
import { useEffect, useState } from "react";
import Phrase from "./Phrase";
import VerifyPhrase from "./VerifyPhrase";
import OfferVault from "./OfferVault";
import VaultFinalized from "./VaultFinalized";
import { confirmWallet } from "./functions";
import { useVaultManager } from "../../../contexts/VaultManager";
import { useUpdateUser, useUser } from "../../../state/application/hooks";
import { useSnackbar } from "notistack";

function VaultCreation({
    nextStage,
    password,
    vaultFinalized,
    setVaultFinalized,
    onboarding = true, // for rendering parts in vault vs onboarding
}) {
    // Component State
    const [processingVault, setProcessingVault] = useState(false);
    const [vaultStep, setVaultStep] = useState(1);
    const [wallet, setWallet] = useState(null);
    const [mnemonic, setMnemonic] = useState([]);
    const [address, setAddress] = useState([]);

    // Application State + Hooks
    const { enqueueSnackbar } = useSnackbar();
    const vaultManager = useVaultManager();
    const updateUser = useUpdateUser();
    const user = useUser();

    const nextStep = () => {
        setVaultStep(vaultStep + 1);
    };

    const prevStep = () => {
        setVaultStep(vaultStep - 1);
    };

    const handleConfirmWallet = () => {
        confirmWallet(
            user,
            updateUser,
            vaultManager,
            mnemonic,
            password,
            setProcessingVault,
            setVaultFinalized,
            enqueueSnackbar
        );
    };

    useEffect(() => {
        const generatedWallet = wallet as any;
        if (generatedWallet !== null) {
            setAddress(generatedWallet.address);
            setMnemonic(generatedWallet.mnemonic.phrase.split(" "));
        }
    }, [wallet]);

    return (
        <div className="vault-container">
            {!vaultFinalized && (
                <>
                    {vaultStep === 1 && (
                        <OfferVault
                            nextStage={nextStage}
                            nextStep={nextStep}
                            onboarding={onboarding}
                        />
                    )}
                    {vaultStep === 2 && (
                        <Phrase
                            nextStep={nextStep}
                            mnemonic={mnemonic}
                            setWallet={setWallet}
                        />
                    )}
                    {vaultStep === 3 && (
                        <VerifyPhrase
                            mnemonic={mnemonic}
                            goBack={prevStep}
                            handleConfirmWallet={handleConfirmWallet}
                            processingVault={processingVault}
                        />
                    )}
                </>
            )}
            {vaultFinalized && (
                <VaultFinalized nextStage={nextStage} onboarding={onboarding} />
            )}
        </div>
    );
}

export default VaultCreation;
