import { useState, useEffect, useRef } from "react";
import "./index.scss";
import Loader from "../../../widgets/Loader";
import MagicText from "../../../MagicText/MagicText";

function VerifyPhrase({
    mnemonic,
    goBack,
    handleConfirmWallet,
    processingVault,
}) {
    const [selectedWords, setSelectedWords] = useState({});
    const [isVerified, setIsVerified] = useState(false);
    const positionsToConfirm = [1, 5, 7, 12];

    const handleWordClick = (word, index) => {
        const wordIndex = Object.values(selectedWords).indexOf(word);
        if (wordIndex !== -1) {
            // If the word exists, remove it from the selected words
            const newSelectedWords = { ...selectedWords };
            const keyToDelete = Object.keys(newSelectedWords).find(
                (key) => newSelectedWords[key] === word
            );
            // @ts-ignore
            delete newSelectedWords[keyToDelete];
            setSelectedWords(newSelectedWords);
        } else {
            const position = positionsToConfirm.find(
                (pos) => !selectedWords[pos - 1]
            );
            if (position) {
                setSelectedWords((prev) => ({ ...prev, [position - 1]: word }));
            }
        }
    };

    const handleConfirmWordClick = (position) => {
        const newSelectedWords = { ...selectedWords };
        delete newSelectedWords[position - 1];
        setSelectedWords(newSelectedWords);
    };
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // swap elements
        }
        return array;
    }
    const [shuffledMnemonic, setShuffledMnemonic] = useState([]);

    useEffect(() => {
        setShuffledMnemonic(shuffleArray([...mnemonic]));
    }, [mnemonic]);

    useEffect(() => {
        const isMatch = positionsToConfirm.every(
            (pos) => selectedWords[pos - 1] === mnemonic[pos - 1]
        );
        setIsVerified(isMatch);
    }, [selectedWords, mnemonic, positionsToConfirm]);

    return (
        <div className={"containerPhrase"}>
            {processingVault && (
                <div id="VaultLoading">
                    <MagicText text={"Generating Vault"} />
                    <Loader show={true} />
                    <MagicText text={"Please Wait"} />
                </div>
            )}
            <div className="verify-container">
                <h1>Confirm Your Vault Phrase</h1>
                <p className="vault-subtitle">
                    Choose the matching words in the correct position!
                </p>
                <div className="confirmation-boxes">
                    {positionsToConfirm.map((pos) => (
                        <div
                            key={pos}
                            className="word-box"
                            onClick={() => handleConfirmWordClick(pos)}
                            data-pos={pos}
                        >
                            {selectedWords[pos - 1] || `Word ${pos}`}
                        </div>
                    ))}
                </div>
                <div className="mnemonic-choices">
                    {shuffledMnemonic.map((word, index) => (
                        <button
                            key={index}
                            className={`word-choice ${
                                Object.values(selectedWords).includes(word)
                                    ? "selected"
                                    : ""
                            }`}
                            onClick={() => handleWordClick(word, index)}
                        >
                            {word}
                        </button>
                    ))}
                </div>

                {isVerified ? (
                    <div>
                        <button
                            className="button"
                            onClick={handleConfirmWallet}
                        >
                            Continue
                        </button>
                    </div>
                ) : (
                    <div>
                        <button className="button" onClick={goBack}>
                            Go Back
                        </button>
                    </div>
                )}
                {!isVerified && (
                    <div className="success-message">
                        You may go back to generate a new one.
                    </div>
                )}
                {isVerified && (
                    <div className="success-message">
                        Verified Successfully 🎉
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyPhrase;
