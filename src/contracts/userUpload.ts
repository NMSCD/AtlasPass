export interface UserUpload<T> {
    uuid: string;
    type: string;
    data?: any;
    url?: string;
    templateData?: T;
}

export const UserUploadTypes = {
    img: 'img',
    txt: 'txt',
}