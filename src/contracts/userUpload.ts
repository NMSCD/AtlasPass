export interface UserUpload<T> {
    uuid: string;
    type: string;
    name?: any;
    data?: any;
    url?: string;
    templateData?: T;
}

export const UserUploadTypes = {
    img: 'img',
    txt: 'txt',
}