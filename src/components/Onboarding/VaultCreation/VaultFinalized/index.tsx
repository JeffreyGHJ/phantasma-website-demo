import "./index.scss";

const VaultFinalized = ({ nextStage, onboarding }) => {
    return (
        <div id="VaultFinalized">
            <div className="heading">Congratulations!</div>

            <div className="sub-title">
                You have successfully created your Vault.
            </div>

            <div className="gift-emoji">🎁</div>

            <div className="reward-message">
                {onboarding
                    ? "Check the account tab to claim a free starter kit from your new Vault."
                    : "You have been rewarded with a free starter kit! The items will soon appear in your vault."}
            </div>

            <div className="continue btn" onClick={() => nextStage()}>
                {onboarding ? "Download Phantasma" : "Finish"}
            </div>
        </div>
    );
};

export default VaultFinalized;
