import "./index.scss";
import { useEffect, useState } from "react";
import VaultCreation from "./VaultCreation";
import FloatingParticles from "../FloatingParticles";
import Register from "./Register";
import Stepper from "./Stepper";
import StageHeading from "./VaultCreation/StageHeading";
import Download from "./Download";
import JSConfetti from "js-confetti";

function Onboarding() {
    const [stage, setStage] = useState(1);
    const [registerFinalized, setRegisterFinalized] = useState(false);
    const [vaultFinalized, setVaultFinalized] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [password, setPassword] = useState("");

    const nextStage = () => {
        setStage(stage + 1);
    };

    const lastStage = () => {
        setStage(3);
    };

    useEffect(() => {
        if (vaultFinalized === true) new JSConfetti().addConfetti();
    }, [vaultFinalized]);

    return (
        <div id="Onboarding" className="scrollbar">
            <FloatingParticles />
            <Stepper
                step={stage}
                setStep={setStage}
                step1Complete={registerFinalized}
                step2Complete={vaultFinalized}
                step3Complete={downloaded}
            />
            <div className="stage-content">
                <StageHeading stage={stage} />
                {stage === 1 && (
                    <Register
                        lastStage={lastStage}
                        nextStage={nextStage}
                        setPass={setPassword}
                        registerFinalized={registerFinalized}
                        setRegisterFinalized={setRegisterFinalized}
                    />
                )}
                {stage === 2 && (
                    <VaultCreation
                        nextStage={nextStage}
                        password={password}
                        vaultFinalized={vaultFinalized}
                        setVaultFinalized={setVaultFinalized}
                        onboarding={true}
                    />
                )}
                {stage === 3 && <Download setDownloaded={setDownloaded} />}
            </div>
        </div>
    );
}

export default Onboarding;
