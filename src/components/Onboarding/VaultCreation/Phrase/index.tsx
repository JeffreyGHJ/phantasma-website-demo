import { useEffect, useState } from "react";
import "./index.scss";
import Checkbox from "../../../widgets/Checkbox/Checkbox";

const ethers = require("ethers");

function MnemonicDisplay({ nextStep, mnemonic, setWallet }) {
    const [confirm, setConfirm] = useState(false);
    const [stepComplete, setStepComplete] = useState(false);

    const toggleConfirm = () => {
        setConfirm(!confirm);
    };

    useEffect(() => {
        setStepComplete(confirm === true);
    }, [confirm]);

    // Each time this Phrase component is mounted a new wallet is regenerated
    // going back to this step effectively resets the wallet to a new one
    useEffect(() => {
        const wallet = ethers.Wallet.createRandom();

        setWallet(wallet);
    }, []);

    const copyToClipboard = async () => {
        const mnemonicPhrase = mnemonic.join(" ");
        try {
            await navigator.clipboard.writeText(mnemonicPhrase);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    return (
        <div id="Phrase">
            <div className="mnemonic-outer-card">
                <div className="heading">12-Word Pass Phrase</div>
                {/* <div className="vault-subtitle">
                    Please write down your pass phrase as this is
                    non-recoverable!
                </div> */}
                <div className="vault-subtitle">
                    This randomly generated 12-word pass phrase will be the key
                    to your Vault which will hold all of your Phantasma items
                    and assets.
                </div>
                <div className="mnemonic-container">
                    {mnemonic.map((word, index) => (
                        <div key={index} className="mnemonic-card">
                            <span className="mnemonic-number">{index + 1}</span>
                            {word}
                        </div>
                    ))}
                </div>

                <button className="copy-button" onClick={copyToClipboard}>
                    Copy
                </button>

                <div className="phrase-reminder">
                    <div className="phrase-reminder-text">
                        The pass phrase above will never be shown again. Ensure
                        that you have it written down or saved before you
                        continue to the next step.
                    </div>
                </div>

                <div className="warning">
                    <div className="warning-text">
                        Warning: Never share this password with anyone.
                        Unauthorized access to this password can lead to theft
                        of all your vault assets.
                    </div>
                    <div className="confirmation">
                        <Checkbox checked={confirm} onChange={toggleConfirm} />
                        <div>I understand</div>
                    </div>
                </div>

                <button
                    className={
                        " continue-button " + (stepComplete ? "" : " disabled ")
                    }
                    onClick={() => nextStep()}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}

export default MnemonicDisplay;
