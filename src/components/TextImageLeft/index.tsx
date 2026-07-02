import React from 'react';
import './index.scss';
import FloatingParticles from "../FloatingParticles";
import Loading from "../widgets/Loading";
import {Link} from "react-router-dom";

const TextImageComponent = ({ headerText, paragraphText, imageUrl }) => {
    return (
        <div className="text-image-container">
            <div className="image-section">
                <img src={imageUrl} alt="Description" />
            </div>
            <div className="text-section">
                <h1>{headerText}</h1>
                <p>{paragraphText}</p>
                <div>
                        <div className='tg-btn-1'>
                            <div>
                                <Link to="/onboarding" className="tg-btn-3 tg-svg mx-auto">
                                    <span>CLAIM NOW</span>
                                </Link>

                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default TextImageComponent;
