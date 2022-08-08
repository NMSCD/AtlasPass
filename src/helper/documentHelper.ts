import { ExportTemplateUserUpload } from "../contracts/exportTemplate";

export const getElementTemplateData = (uuid: string): ExportTemplateUserUpload => {
    const currentNode: any = document.querySelector('#id' + uuid + '.template-data');
    const attrData = currentNode.getAttribute('data-template');
    const jsonData = JSON.parse(atob(attrData));

    return jsonData;
}

export const getAllElementsTemplateData = (): Array<ExportTemplateUserUpload> => {
    const allTemplateNodes = document.querySelectorAll('.template-data');
    const allJsonItems: Array<ExportTemplateUserUpload> = [];
    for (const node of allTemplateNodes) {
        const attrData = node.getAttribute('data-template');
        if (attrData == null || attrData.length < 10) continue;

        try {
            allJsonItems.push(JSON.parse(atob(attrData)));
        } catch (ex) {
            //
        }
    }

    return allJsonItems;
}