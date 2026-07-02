import "./index.scss";
import Modal from "../../../../widgets/Modal";
import VaultCreation from "../../../../Onboarding/VaultCreation";
import { useEffect, useState } from "react";
import JSConfetti from "js-confetti";
import ConfirmPassword from "./ConfirmPassword";
import { createCustomCanvas } from "./functions";

const CreateVault = ({ user }) => {
    const [password, setPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [vaultFinalized, setVaultFinalized] = useState(false);

    useEffect(() => {
        if (vaultFinalized === true) {
            // create custom canvas element with higher z-index than modal
            const canvas = createCustomCanvas();

            // create jsConfetti object with custom canvas
            const jsConfetti = new JSConfetti({ canvas });

            // add confetti then remove canvas element when done
            jsConfetti.addConfetti().then(() => canvas.remove());
        }
    }, [vaultFinalized]);

    return (
        <>
            {user && user.VaultEVMAddress === null && (
                <div className="vault-btn" onClick={() => setModalOpen(true)}>
                    <div className="gift-emoji">🎁</div>
                    Create Vault
                </div>
            )}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                className={passwordConfirmed ? "create-vault-modal" : ""}
            >
                {!passwordConfirmed && (
                    <ConfirmPassword
                        user={user}
                        setPassword={setPassword}
                        setPasswordConfirmed={setPasswordConfirmed}
                    />
                )}
                {passwordConfirmed && (
                    <VaultCreation
                        nextStage={() => setModalOpen(false)}
                        password={password}
                        vaultFinalized={vaultFinalized}
                        setVaultFinalized={setVaultFinalized}
                        onboarding={false}
                    />
                )}
            </Modal>
        </>
    );
};

export default CreateVault;
