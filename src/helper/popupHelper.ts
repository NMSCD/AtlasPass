import Swal, { SweetAlertInput } from "sweetalert2";
import { imageFilter } from "../constants/background";
import { timeout } from "./asyncHelper";

export interface IStringInputPopupProps {
    title: string;
    input: SweetAlertInput | undefined;
    inputValue?: string;
    focusOnInput?: boolean;
}
export const stringInputPopup = async (props: IStringInputPopupProps): Promise<string> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        input: props.input,
        inputValue: props.inputValue ?? '',
        showCancelButton: true,
        inputAttributes: props.focusOnInput !== true ? undefined : {
            autofocus: 'true'
        }
    });

    if (props.focusOnInput) {
        await timeout(300);
        let queryStr = 'input.swal2-input';
        if (props.input == 'textarea') queryStr = 'textarea.swal2-textarea';
        const swalInput: any = document.querySelector(queryStr);
        swalInput?.focus?.();
    }
    const { value } = await firstSwalPromise;

    return value;
}

export interface IFileInputPopupProps {
    title: string;
    acceptFilter?: string;
}
export const fileInputPopup = async (props: IFileInputPopupProps): Promise<any> => {

    const firstSwalPromise = Swal.fire({
        title: props.title,
        input: 'file',
        showCancelButton: true,
        inputAttributes: {
            'accept': props.acceptFilter ?? imageFilter,
            'aria-label': props.title,
        }
    });

    const { value } = await firstSwalPromise;
    return value;
}