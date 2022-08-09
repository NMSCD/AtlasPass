import { BackgroundOption } from "../contracts/backgroundOption";

export const backgroundsFolder = '/assets/img/backgrounds/';
export const backgroundNmsCover = backgroundsFolder + 'nmsCover.jpg';
export const backgroundAtlasPassCover1 = backgroundsFolder + 'atlasPassCover1.jpg';
export const backgroundSphynx1 = backgroundsFolder + 'sphynx1.png';
export const backgroundSphynx2 = backgroundsFolder + 'sphynx2.png';
export const backgroundSphynx3 = backgroundsFolder + 'sphynx3.png';
export const backgroundHexagon1 = backgroundsFolder + 'hexagon1.png';
export const backgroundAtlasPass1 = backgroundsFolder + 'atlasPass1.png';
export const backgroundAtlasPass2 = backgroundsFolder + 'atlasPass2.png';

export const builtInBackgrounds: Array<BackgroundOption> = [
    {
        name: 'NMS Cover image',
        imgUrl: backgroundNmsCover,
    },
    {
        name: 'Atlas Rising',
        imgUrl: backgroundAtlasPassCover1,
    },
    {
        name: 'Sphynxcolt1',
        imgUrl: backgroundSphynx1,
    },
    {
        name: 'Sphynxcolt2',
        imgUrl: backgroundSphynx2,
    },
    {
        name: 'Sphynxcolt3',
        imgUrl: backgroundSphynx3,
    },
    {
        name: 'Hexagon1',
        imgUrl: backgroundHexagon1,
    },
    {
        name: 'Atlas Pass Vector (Sphynxcolt)',
        imgUrl: backgroundAtlasPass2,
    },
    {
        name: 'Atlas Pass Level 4',
        imgUrl: backgroundAtlasPass1,
    },
];


export const imageFilter = "image/*"