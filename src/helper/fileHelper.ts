
import domtoimage from 'dom-to-image';

export const downloadFile = (dataUrl: any, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    link.remove();
}

export const downloadJsonAsFile = (data: any, filename: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    downloadFile(dataStr, filename);
}


export const exportToPng = async (cardElem: any): Promise<string> => {
    const dataUrl = await domtoimage.toPng(cardElem);
    return dataUrl;
}

export const readFileAsync = (file: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
    })
}

// export const exportToGif = async (cardElem: any, width: number, height: number): Promise<string> => {

//     const pixelData = await domtoimage.toPixelData(cardElem);
//     const pixelToGif: any = await pixelsToGIF(pixelData, width, height);

//     return pixelToGif;
// }

// const pixelsToGIF = (pixels: any, width: number, height: number) =>
//     new Promise((resolve, reject) => {
//         const gif = new GifEncoder(width, height);
//         gif.pipe(concat(resolve));
//         gif.pipe(concatStream(function (gifBuff) {
//             // gifBuff is raw image data in Buffer format
//             // Convert our image to a data URI
//             //   https://css-tricks.com/data-uris/
//             var img = new Image();
//             img.src = 'data:image/gif;base64' + gifBuff.toString('base64');

//             // Add image to page
//             document.body.appendChild(img);
//         }));
//         gif.writeHeader();
//         gif.addFrame(pixels);
//         gif.finish();
//         gif.on('error', reject);
//     });
