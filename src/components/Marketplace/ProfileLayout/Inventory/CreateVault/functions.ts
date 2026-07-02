export const createCustomCanvas = () => {
    // create custom canvas element
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.top = "0";
    canvas.style.left = "0";
    // make sure z-index is greater than any part of modal
    canvas.style.zIndex = "9999999";
    canvas.style.pointerEvents = "none";

    // add to doc
    document.body.appendChild(canvas);

    return canvas;
};
