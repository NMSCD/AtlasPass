import { Component, JSX } from "solid-js";

interface IProps {
    id?: string;
    href: string;
    title?: string;
    onClick?: () => void;
    additionalClassNames?: string;
    children?: JSX.Element;
}

export const siteRef = 'nmscdCommunitySearch';

export const BasicLink: Component<IProps> = (props: IProps) => {
    const appendRef = (baseUrl: string) => {
        if (baseUrl.includes('@')) return baseUrl;
        if (baseUrl.includes('?')) {
            return baseUrl + `&ref=${siteRef}`;
        }
        return baseUrl + `?ref=${siteRef}`;
    };

    const localClick = (e: any) => {
        if (props.onClick != null) {
            e.preventDefault();
            props.onClick();
        }
    }

    return (
        <a
            id={props.id}
            href={appendRef(props.href)}
            target="_blank"
            rel="noopener noreferrer"
            class={props.additionalClassNames ?? ''}
            onClick={localClick}
            draggable={false}>
            {props.children}
        </a>
    );
}

