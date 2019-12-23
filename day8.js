const fs = require('fs');

const decodeImage = (data, w, h) => {
    const pixelsPerLayer = w * h;
    if (data.length % pixelsPerLayer != 0) {
        throw 'image data length (' + data.length + ') does not match layer dimensions (' + w + 'x' + h + ')';
    }

    const layers = [];
    for (let i = 0; i < data.length; i += pixelsPerLayer) {
        layers.push(data.substring(i, i + pixelsPerLayer));
    }
    return layers;
}

const renderImage = (image, w, h) => {
    let pixels = '';
    let pixelCount = w * h;
    for (let i = 0; i < pixelCount; i++) {
        if (i % w == 0) {
            pixels += '\n';
        }
        pixels += determinePixelColor(image, i);
    }
    return pixels;
}

const drawImage = (renderedImage) => {
    console.log(renderedImage.replace(/0/g, '░').replace(/1/g, '▓'));
}

const determinePixelColor = (image, i) => {
    let pixelColor = 2;
    image.forEach(layer => {
        const layerColor = layer[i];
        pixelColor = (pixelColor === 2 ? parseInt(layerColor) : pixelColor);
    });
    return pixelColor;
}

const countDigits = (layer, num) => {
    return layer.split('').reduce((count, char) => count += parseInt(char) === num ? 1 : 0, 0);
}

const getLayerWithLowestDigitCount = (layers, digit) => {
    let match = null;
    let minDigits = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < layers.length; i++) {
        let layer = layers[i];
        let matchingDigits = countDigits(layer, digit);
        if (matchingDigits < minDigits) {
            match = layer;
            minDigits = matchingDigits;
        }
    }
    return match;
}

const verifyImage = (image) => {
    const verifyLayer = getLayerWithLowestDigitCount(image, 0);
    const ones = countDigits(verifyLayer, 1);
    const twos = countDigits(verifyLayer, 2);
    //console.log('counted', ones, 'ones and', twos, 'twos in layer', verifyLayer);
    return ones * twos;
}

const test = () => {
    const image = decodeImage('123456789012', 3, 2);
    console.log('test 1?', image[0] == '123456' && image[1] == '789012');
    //console.log('test 2?', countDigits(image[0], 0) === 0 && countDigits(image[1], 0) === 1);
    console.log('test 3?', getLayerWithLowestDigitCount(image, 0) == '123456');
    console.log('test 4?', verifyImage(image) == 1);

    const renderedImage = renderImage(decodeImage('0222112222120000', 2, 2), 2, 2);
    console.log('test 5?', renderedImage == '0110', drawImage(renderedImage));
}

const dailyProblems = () => {
    const input = fs.readFileSync('day8-input').toString().trim();
    const image = decodeImage(input, 25, 6);
    console.log(1, verifyImage(image));
    console.log(2);
    drawImage(renderImage(image, 25, 6));
}

test();
dailyProblems();
