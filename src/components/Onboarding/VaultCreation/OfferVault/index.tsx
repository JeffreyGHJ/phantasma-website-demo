import "./index.scss";

const OfferVault = ({ nextStage, nextStep, onboarding }) => {
    return (
        <div id="OfferVault">
            <div className="heading">
                Your Vault can secure and store items earned in Phantasma
            </div>
            <div className="reward-message">
                <div className="image-container">
                    <img src="https://littleghosts.s3.us-east-2.amazonaws.com/phantasma/starter_kit/2/1.png" alt="Starter Kit 1" />
                    <img src="https://littleghosts.s3.us-east-2.amazonaws.com/phantasma/starter_kit/2/2.png" alt="Starter Kit 2" />
                    <img src="https://littleghosts.s3.us-east-2.amazonaws.com/phantasma/starter_kit/2/3.png" alt="Starter Kit 3" />
                </div>
                <div className="">
                    Users who create a Vault for the first time will get a
                    free starter kit! 🎁
                </div>
            </div>

            <div className="continue-create btn" onClick={() => nextStep()}>
                Create a Vault
            </div>
            <div className="next-stage btn" onClick={() => nextStage()}>
                {onboarding ? "Skip Vault Creation" : "Cancel"}
            </div>

            <div className="skip-vault-note">
                {onboarding
                    ? "You can skip Vault creation now and set it up later via your account settings"
                    : "You may cancel and set up your vault later"}
            </div>
        </div>
    );
};

export default OfferVault;
