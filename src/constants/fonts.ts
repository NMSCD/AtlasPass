import { DropDownOption } from "../contracts/dropDownOption";
import { FontOption } from "../contracts/fontOption";

export const builtInFontNMSfontFuturaProBook = 'NMSFuturaProBook';
export const builtInFontNMSfontGeoSans = 'NMSGeoSans';
export const builtInFontExpeditionfont = 'NMS Alphabet';

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

