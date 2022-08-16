import { DropDownOption } from "../contracts/dropDownOption";
import { FontOption } from "../contracts/fontOption";

export const builtInFontNMSfontFuturaProBook = 'NMSFuturaProBook';
export const builtInFontNMSfontGeoSans = 'NMSGeoSans';
export const builtInFontExpeditionfont = 'NMS Alphabet';
export const builtInFontPortalfont = 'NMS-Glyphs-Mono';

export const builtInFonts: Array<FontOption> = [
    {
        name: 'Default',
        fontFamily: '',
    },
    {
        name: 'NMS font (FuturaProBook)',
        fontFamily: builtInFontNMSfontFuturaProBook,
    },
    {
        name: 'NMS font (GeoSans)',
        fontFamily: builtInFontNMSfontGeoSans,
    },
    {
        name: 'Expedition font',
        fontFamily: builtInFontExpeditionfont,
    },
    {
        name: 'NMS portals',
        allowedChars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f'],
        maxChars: 12,
        fontFamily: builtInFontPortalfont,
    },
];

export const textAlignOptions: Array<DropDownOption> = [
    {
        name: 'Left',
        value: 'left',
    },
    {
        name: 'Center',
        value: 'center',
    },
    {
        name: 'Right',
        value: 'right',
    },
];

