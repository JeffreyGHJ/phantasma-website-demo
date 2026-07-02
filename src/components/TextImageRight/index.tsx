import React from "react";
import "./index.scss";

const TextImageComponent = ({ headerText, paragraphText, imageUrl }) => {
    return (
        <div className="text-image-container-right">
            <div className="text-section-right">
                <h1>{headerText}</h1>
                <p>{paragraphText}</p>
            </div>
            <div className="image-section-right">
                <img src={imageUrl} alt="Description" />
            </div>
        </div>
    );
};

export default TextImageComponent;
