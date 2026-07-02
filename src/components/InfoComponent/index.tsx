import { transform } from "lodash";
import "./index.scss";
import { Link } from "react-router-dom";

const RewardComponent = ({ headerText, paragraphText, imageUrl }) => {
    return (
        <div id="Info">

            <div className="text-section">
                <h1>{headerText}</h1>
                <p>{paragraphText}</p>

                <Link to="/onboarding">
                    <div className="claim-now-btn">Learn More</div>
                </Link>
            </div>
            <div className="image-section">
                <img src={imageUrl} alt="Description" />
            </div>
        </div>
    );
};

export default RewardComponent;
