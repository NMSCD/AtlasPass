import { v4 as uuidv4 } from 'uuid';
import { IPassImageTemplateProps } from '../components/pass/passImage';
import { IPassTextTemplateProps } from '../components/pass/passText';
import { PromoteType } from '../constants/enum/promoteType';
import { ExportTemplate } from '../contracts/exportTemplate';
import { UserUpload, UserUploadTypes } from '../contracts/userUpload';
import { timeout } from '../helper/asyncHelper';
import { readFileAsync } from '../helper/fileHelper';
import { gridRefWidth } from '../helper/gridRefHelper';
import { fileInputPopup, stringInputPopup } from '../helper/popupHelper';
import { backgroundHexagon1, jsonFilter } from './background';
import { NetworkState } from './enum/networkState';
import { builtInFontExpeditionfont, builtInFontNMSfontGeoSans } from './fonts';
import { templatePath } from './images';

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

export const customTemplate: TemplateBuilder = {
    name: 'Use Custom template (experimental)',
    imgUrl: templatePath + 'nmscd.png',
    initial: async (func: IBuilderFunctions, gridRefKey: string): Promise<any> => {

        const templateJsonRef = await fileInputPopup({
            title: 'Select template JSON',
            acceptFilter: jsonFilter,
        });
        const templateJson = await readFileAsync(templateJsonRef);
        const templObj: ExportTemplate = JSON.parse(templateJson.toString());
        const minimumWaitPromise = timeout(2000);

        func.setIsPortrait(templObj.isPortrait);
        func.setUseCustomBackgroundImage(templObj.useCustomBackgroundImage);
        func.setBackgroundImageOpacity(templObj.backgroundImageOpacity);
        func.setBackgroundImage(templObj.backgroundImage);
        func.setEnableGrid(templObj.enableGrid);
        func.setGridSnapPoints(templObj.gridSnapPoints);
        func.setPromoteToShow(templObj.promoteToShow);

        for (let imageIndex = 0; imageIndex < templObj.userImages.length; imageIndex++) {
            const userImage = templObj.userImages[imageIndex];
            let userImageUrl = userImage.url;
            if (userImageUrl.includes('/assets/img/') == false) {
                const userImageRef = await fileInputPopup({
                    title: userImage.name ?? 'No image name specified',
                });
                userImageUrl = URL.createObjectURL(userImageRef);
            }

            templObj.userImages[imageIndex].url = userImageUrl;
        }

        for (let textIndex = 0; textIndex < templObj.userTexts.length; textIndex++) {
            const userText = templObj.userTexts[textIndex];
            const displayText = await stringInputPopup({
                title: userText.name ?? 'No text name specified',
                input: 'text',
                focusOnInput: true,
            });

            templObj.userTexts[textIndex].templateData.displayText = displayText;
        }

        await minimumWaitPromise;

        return templObj;
    },
    build: async (func: IBuilderFunctions, gridRefKey: string, additionalData: any) => {

        const images = additionalData.userImages.map((ui: any) => ({
            uuid: uuidv4(),
            type: ui.type,
            name: ui.name,
            url: ui.url,
            templateData: { ...ui.templateData }
        }));
        func.setUserImages(images);

        const texts = additionalData.userTexts.map((ui: any) => ({
            uuid: uuidv4(),
            type: ui.type,
            name: ui.name,
            templateData: { ...ui.templateData }
        }));
        func.setUserTexts(texts);
    }
}

export const nmscdTemplate: TemplateBuilder = {
    name: 'NMSCD pass',
    imgUrl: 'https://avatars.githubusercontent.com/t/5776046?s=280&v=4',
    initial: async (func: IBuilderFunctions, gridRefKey: string): Promise<any> => {
        func.setIsPortrait(true);
        const minimumWaitPromise = timeout(3000);

        func.setUseCustomBackgroundImage(false);
        func.setEnableGrid(false);
        func.setBackgroundImage(backgroundHexagon1);
        func.setPromoteToShow(PromoteType.nmscd);

        const username = await stringInputPopup({
            title: 'Enter your Username',
            input: 'text',
            focusOnInput: true,
        });

        const friendcode = await stringInputPopup({
            title: 'Enter your Friend Code',
            input: 'text',
        });
        const role = await stringInputPopup({
            title: 'Enter your Role',
            input: 'text',
        });

        await minimumWaitPromise;
        return {
            username,
            friendcode,
            role,
        };
    },
    build: async (func: IBuilderFunctions, gridRefKey: string, additionalData: any) => {
        const imageWidth = gridRefWidth(gridRefKey) as any;
        const {
            username = 'Username',
            friendcode = 'FriendCode',
            role = 'Role',
        } = additionalData;
        func.setUserImages([
            {
                uuid: uuidv4(),
                type: UserUploadTypes.img,
                name: 'HGRET Logo',
                url: 'https://avatars.githubusercontent.com/t/5776046?s=280&v=4',
                templateData: {
                    initHeight: 300,
                    initWidth: imageWidth,
                    initX: 0,
                    initY: 100,
                    zIndex: 10,
                    isCenterHorizontally: true,
                }
            }
        ]);
        func.setUserTexts([
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                name: 'Username',
                templateData: {
                    displayText: username,
                    fontAlign: 'center',
                    fontFamily: builtInFontNMSfontGeoSans,
                    initHeight: 40,
                    initWidth: imageWidth / 2,
                    initX: 0,
                    initY: 380,
                    zIndex: 10,
                    isCenterHorizontally: true,
                }
            },
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                name: 'FriendCode',
                templateData: {
                    displayText: friendcode,
                    fontAlign: 'center',
                    fontFamily: builtInFontNMSfontGeoSans,
                    initHeight: 40,
                    initWidth: imageWidth / 2,
                    initX: 0,
                    initY: 405,
                    zIndex: 10,
                    isCenterHorizontally: true,
                }
            },
            {
                uuid: uuidv4(),
                type: UserUploadTypes.txt,
                name: 'Role',
                templateData: {
                    displayText: role,
                    fontAlign: 'center',
                    fontFamily: builtInFontExpeditionfont,
                    fontColour: 'red',
                    initHeight: 40,
                    initWidth: imageWidth / 2,
                    initX: 0,
                    initY: 430,
                    zIndex: 10,
                    isCenterHorizontally: true,
                }
            }
        ]);
    }
}

export const allTemplates: Array<TemplateBuilder> = [
    nmscdTemplate,
];