import { IPassImageTemplateProps } from '../components/pass/passImage';
import { IPassTextTemplateProps } from '../components/pass/passText';
import { PromoteType } from '../constants/enum/promoteType';
import { UserUpload, UserUploadTypes } from '../contracts/userUpload';
import { templatePath } from './images';
import { v4 as uuidv4 } from 'uuid';
import { NetworkState } from './enum/networkState';
import { timeout } from '../helper/asyncHelper';
import { builtInFontExpeditionfont, builtInFontNMSfontGeoSans } from './fonts';
import { backgroundHexagon1 } from './background';
import Swal from 'sweetalert2';

export interface IBuilderFunctions {
    setTemplateState: (newState: NetworkState) => void;
    setUseCustomBackgroundImage: (newV: boolean) => void;
    setIsPortrait: (newV: boolean) => void;
    setEnableGrid: (newV: boolean) => void;
    setGridSnapPoints: (newV: number) => void;
    setBackgroundImage: (imgUrl: string) => void;
    setBackgroundImageOpacity: (newV: number) => void;
    setUserImages: (newImgs: Array<UserUpload<IPassImageTemplateProps>>) => void;
    setUserTexts: (newTexts: Array<UserUpload<IPassTextTemplateProps>>) => void;
    setPromoteToShow: (promote: PromoteType) => void;
}

export interface TemplateBuilder {
    name: string;
    imgUrl: string;
    initial: (funcs: IBuilderFunctions, gridRefKey: string) => Promise<any>;
    build: (funcs: IBuilderFunctions, gridRefKey: string, additionalData: any) => Promise<void>;
}

export const nmscd: TemplateBuilder = {
    name: 'NMSCD pass',
    imgUrl: templatePath + 'nmscd.png',
    initial: async (func: IBuilderFunctions, gridRefKey: string): Promise<any> => {
        const minimumWaitPromise = timeout(2000);
        func.setIsPortrait(true);
        func.setUseCustomBackgroundImage(true);
        func.setBackgroundImage(backgroundHexagon1);

        const { value: username } = await Swal.fire({
            title: 'Enter your Username',
            input: 'text',
            showCancelButton: true,
        });
        const { value: friendcode } = await Swal.fire({
            title: 'Enter your Friend Code',
            input: 'text',
            showCancelButton: true,
        });
        const { value: role } = await Swal.fire({
            title: 'Enter your Role',
            input: 'text',
            showCancelButton: true,
        });

        await minimumWaitPromise;
        return {
            username,
            friendcode,
            role,
        };
    },
    build: async (func: IBuilderFunctions, gridRefKey: string, additionalData: any) => {
        const imageWidth = gridRefKey.split('-')[0] as any;
        const {
            username = 'Username',
            friendcode = 'FriendCode',
            role = 'Role',
        } = additionalData;
        func.setUserImages([
            {
                uuid: uuidv4(),
                type: UserUploadTypes.img,
                url: 'https://avatars.githubusercontent.com/t/5776046?s=280&v=4',
                templateData: {
                    initHeight: 300,
                    initWidth: imageWidth,
                    initX: 0,
                    initY: 100,
                    zIndex: 10,
                }
            }
        ]);
        func.setUserTexts([
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                templateData: {
                    displayText: username,
                    fontAlign: 'center',
                    fontFamily: builtInFontNMSfontGeoSans,
                    initHeight: 40,
                    initWidth: imageWidth,
                    initX: 0,
                    initY: 380,
                    zIndex: 10,
                }
            },
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                templateData: {
                    displayText: friendcode,
                    fontAlign: 'center',
                    fontFamily: builtInFontNMSfontGeoSans,
                    initHeight: 40,
                    initWidth: imageWidth,
                    initX: 0,
                    initY: 405,
                    zIndex: 10,
                }
            },
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                templateData: {
                    displayText: role,
                    fontAlign: 'center',
                    fontFamily: builtInFontExpeditionfont,
                    fontColour: 'red',
                    initHeight: 40,
                    initWidth: imageWidth,
                    initX: 0,
                    initY: 430,
                    zIndex: 10,
                }
            }
        ]);
        func.setPromoteToShow(PromoteType.nmscd);
    }
}

export const allTemplates: Array<TemplateBuilder> = [
    nmscd,
];