export interface ExportTemplate {
    useCustomBackgroundImage: boolean;
    isPortrait: boolean;
    enableGrid: boolean;
    gridSnapPoints: number;
    backgroundImage: string;
    backgroundImageOpacity: number;
    promoteToShow: string;
    width: string;
    height: string;
    userImages: Array<ExportTemplateUserUpload>;
    userTexts: Array<ExportTemplateUserUpload>;
}

export interface ExportTemplateUserUpload {
    uuid: string;
    name: string;
    type: string;
    url: string;
    templateData: ExportTemplateUserUploadTemplateDataCommon;
}

export interface ExportTemplateUserUploadTemplateDataCommon {
    rotation: number;
    zIndex: number;
    initHeight: number;
    initWidth: number;
    initX: number;
    initY: number;
    //
    displayText?: string;
    fontFamily?: string;
    fontSize?: number;
    fontColour?: string;
    fontAlign?: string;
}
