import "./index.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Check = CheckCircleIcon;

const Stepper = ({
    step,
    setStep,
    step1Complete,
    step2Complete,
    step3Complete,
}) => {
    return (
        <div id="Stepper">
            <div className="stepper-edge" />
            <div className={"node-wrapper" + (step === 1 ? " active " : "")}>
                {step1Complete && <Check className="check" />}
                <div className="node" onClick={() => setStep(1)}>
                    <div className="label">1</div>
                </div>
                <div className="description">Register New Account</div>
            </div>
            <div className="line" />
            <div className={"node-wrapper" + (step === 2 ? " active " : "")}>
                {step2Complete ? (
                    <Check className="check" />
                ) : (
                    <div className="animated-gift-emoji">🎁</div>
                )}

                <div
                    className="node"
                    onClick={() => (step1Complete ? setStep(2) : {})}
                >
                    <div className="label">2</div>
                </div>
                <div className="description">Vault (Optional)</div>
            </div>
            <div className="line" />
            <div className={"node-wrapper" + (step === 3 ? " active " : "")}>
                {step3Complete && <Check className="check" />}
                <div
                    className="node"
                    onClick={() => (step2Complete ? setStep(3) : {})}
                >
                    <div className="label">3</div>
                </div>
                <div className="description">Download Game</div>
            </div>
            <div className="stepper-edge" />
        </div>
    );
};

export default Stepper;
