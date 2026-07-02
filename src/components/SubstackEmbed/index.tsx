import React, { useEffect } from 'react';

// Extend the Window interface
declare global {
    interface Window {
        CustomSubstackWidget: {
            substackUrl: string;
            placeholder: string;
            buttonText: string;
            theme: string;
            // Add any other properties if needed
        };
    }
}

const SubstackEmbed: React.FC = () => {
    useEffect(() => {
        // Define the CustomSubstackWidget configuration
        window.CustomSubstackWidget = {
            substackUrl: "phantasma.substack.com",
            placeholder: "example@gmail.com",
            buttonText: "Subscribe",
            theme: "custom",
            // @ts-ignore
            colors: {
                primary: "#171717",
                input: "#090909",
                email: "#FFFFFF",
                text: "#FFFFFF"
            }
        };

        // Create and append the script to the document
        const script = document.createElement('script');
        script.src = "https://substackapi.com/widget.js";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <p style={{ textAlign: 'center' }}>Do you want to know when the full release drops & get updates along the way?</p>
            <div id="custom-substack-embed"></div>
        </div>
    );
}

export default SubstackEmbed;
