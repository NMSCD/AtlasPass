import { Component, createMemo, JSX } from 'solid-js';
import { IPassDraggableFunctions, IPassDraggableProps, IPassDraggableState, PassDraggable } from './passDraggable';

interface IPassImageProps {
    src: string;
    initX?: number;
    initY?: number;
    onDelete: () => void;
}

export const PassImage: Component<IPassImageProps> = (props: IPassImageProps) => {

    const renderImage = (
        draggableProps: IPassDraggableProps,
        draggableState: IPassDraggableState,
        draggableFunctions: IPassDraggableFunctions
    ): JSX.Element => {

        let styleWidth = createMemo(() => {
            if (draggableState.width != undefined && draggableState.width > 0) {
                return " width: " + draggableState.width + "px;";
            } else {
                return " width: 100px;";
            }
        });

        let styleHeight = createMemo(() => {
            if (draggableState.height != undefined && draggableState.height > 0) {
                return " height: " + draggableState.height + "px;";
            } else {
                return " height: 100px;";
            }
        });

        return (
            <img
                class="user-img"
                src={props.src}
                draggable={true}
                onMouseDown={draggableFunctions.mouseDown}
                onTouchStart={draggableFunctions.touchStart}
                ondragstart={(ev) => ev?.preventDefault?.()}
                style={styleWidth() + styleHeight()}
            />
        );
    }


    return (
        <PassDraggable
            {...props}
            renderChild={renderImage}
        />
    );
}

