import { transform } from "lodash";
import "./index.scss";
import { Link } from "react-router-dom";
import LightRayEffect from "./LightRayEffect";

const RewardComponent = ({ headerText, paragraphText, imageUrl }) => {
    return (
        <div id="Reward">
            <div className="image-section">
                <LightRayEffect />
                <img src={imageUrl} alt="Description" />
            </div>

            <div className="text-section">
                <h1>{headerText}</h1>
                <p>{paragraphText}</p>

                <Link to="/onboarding">
                    <div className="claim-now-btn">CLAIM NOW</div>
                </Link>
            </div>
        </div>
    );
};

export default RewardComponent;
