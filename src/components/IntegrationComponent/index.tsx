import React from 'react';
import "./index.scss";

const logos = [
    { imageUrl: "/images/unreal.png", alt: 'Unreal' },
    { imageUrl: "/images/solana.png", alt: 'Solana' },
    { imageUrl: "/images/polygon.png", alt: 'Polygon' },
    { imageUrl: "/images/bnbchain.png", alt: 'Bnbchain' },
    // Add other logos here
];
const IntegrationComponent = ({ }) => {
    return (
        <div id="Integrations">
            <h1 className="title">Integrations</h1>
            <div className="logos-row">
                {logos.map((logo, index) => (
                    <div key={index} className="logo">
                        <img src={logo.imageUrl} alt={logo.alt} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntegrationComponent;

