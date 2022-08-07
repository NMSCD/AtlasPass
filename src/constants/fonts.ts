import { DropDownOption } from "../contracts/dropDownOption";
import { FontOption } from "../contracts/fontOption";

export const builtInFonts: Array<FontOption> = [
    {
        name: 'Default',
        fontFamily: '',
    },
    {
        name: 'NMS font (FuturaProBook)',
        fontFamily: 'NMSFuturaProBook',
    },
    {
        name: 'NMS font (GeoSans)',
        fontFamily: 'NMSGeoSans',
    },
    {
        name: 'Expedition font',
        fontFamily: 'NMS Alphabet',
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

