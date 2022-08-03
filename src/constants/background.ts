import { BackgroundOption } from "../contracts/backgroundOption";

export const backgroundsFolder = '/assets/img/';
export const builtInBackgrounds: Array<BackgroundOption> = [
    {
        name: 'NMS Cover image',
        imgUrl: backgroundsFolder + 'nmsCover.jpg',
    },
    {
        name: 'Atlas Rising',
        imgUrl: backgroundsFolder + 'atlasPassCover1.jpg',
    },
    {
        name: 'Atlas Pass Level 4',
        imgUrl: backgroundsFolder + 'atlasPass1.png',
    },
];


export const imageFilter = "image/*"