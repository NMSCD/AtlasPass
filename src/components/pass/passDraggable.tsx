import { createStore } from 'solid-js/store';
import { batch, Component, createMemo, JSX, onCleanup, onMount, Show } from 'solid-js';

export interface IPassDraggableState {
    dragging: boolean,
    resizing: boolean,
    startOffsetX?: number,
    startOffsetY?: number,
    x: number,
    y: number,
    width?: number,
    height?: number
}

export interface IPassDraggableProps {
    initX?: number;
    initY?: number;
    rotation?: number;
    renderChild: (props: IPassDraggableProps, state: IPassDraggableState, functions: IPassDraggableFunctions) => JSX.Element;
    onEdit?: () => void;
    onDelete: () => void;
}

export interface IPassDraggableFunctions {
    mouseDown: (e: MouseEvent) => void;
    touchStart: (e: TouchEvent) => void;
}

export const PassDraggable: Component<IPassDraggableProps> = (props: IPassDraggableProps) => {

    let parent: any;
    let dialog: any;

    let initX: number = (props.hasOwnProperty("initX") ? props.initX : 0) ?? 0;
    let initY: number = (props.hasOwnProperty("initY") ? props.initY : 0) ?? 0;
    const [state, setState] = createStore<IPassDraggableState>({
        dragging: false,
        resizing: false,
        x: initX,
        y: initY
    });

    onMount(() => {
        batch(() => {
            parent = dialog.parentNode;
            parent.addEventListener("mousemove", mouseMove, { passive: true });
            parent.addEventListener("mouseup", mouseUp);
            parent.addEventListener("mouseleave", mouseLeave);
            parent.addEventListener("touchmove", touchMove, { passive: true });
            parent.addEventListener("touchend", touchEnd);
            parent.addEventListener("touchcancel", touchCancel);
            let rect = dialog.getBoundingClientRect();
            setState("width", rect.width);
            setState("height", rect.height);
        });
    });

    onCleanup(() => {
        parent.removeEventListener("mousemove", mouseMove);
        parent.removeEventListener("mouseup", mouseUp);
        parent.removeEventListener("mouseleave", mouseLeave);
        parent.removeEventListener("touchmove", touchMove);
        parent.removeEventListener("touchend", touchEnd);
        parent.removeEventListener("touchcancel", touchCancel);
    });

    const dragStart = (x: number, y: number) => {
        batch(() => {
            setState("dragging", true);
            setState("startOffsetX", x - state.x);
            setState("startOffsetY", y - state.y);
        });
    }

    const dragMove = (x: number, y: number) => {
        if (!state.dragging) {
            return;
        }
        batch(() => {
            setState("x", x - (state.startOffsetX ?? 0));
            setState("y", y - (state.startOffsetY ?? 0));
        });
    }

    const dragEnd = () => {
        if (!state.dragging) {
            return;
        }
        batch(() => {
            setState("dragging", false);
            setState("startOffsetX", undefined);
            setState("startOffsetY", undefined);
        });
    }

    const resizeStart = (x: number, y: number) => {
        batch(() => {
            setState("resizing", true);
            setState("startOffsetX", x - (state.x + (state.width ?? 0)));
            setState("startOffsetY", y - (state.y + (state.height ?? 0)));
        });
    }

    const resizeMove = (x: number, y: number) => {
        batch(() => {
            setState("width", x - (state.startOffsetX ?? 0) - state.x);
            setState("height", y - (state.startOffsetY ?? 0) - state.y);
        });
    }

    const resizeEnd = () => {
        batch(() => {
            setState("resizing", false);
            setState("startOffsetX", undefined);
            setState("startOffsetY", undefined);
        });
    }

    const mouseDown = (e: MouseEvent) => {
        dragStart(e.clientX, e.clientY);
    }

    const mouseDownResizeCorner = (e: MouseEvent) => {
        resizeStart(e.clientX, e.clientY);
    }

    const mouseMove = (e: MouseEvent) => {
        if (state.dragging) {
            dragMove(e.clientX, e.clientY);
        } else if (state.resizing) {
            resizeMove(e.clientX, e.clientY);
        }
    }

    const mouseUp = (e: MouseEvent) => {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    const mouseLeave = (e: MouseEvent) => {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    const touchStart = (e: TouchEvent) => {
        if (e.touches.length != 1) {
            return;
        }
        dragStart(e.touches[0].clientX, e.touches[0].clientY);
    }

    const touchStartResizeCorner = (e: TouchEvent) => {
        if (e.touches.length != 1) {
            return;
        }
        resizeStart(e.touches[0].clientX, e.touches[0].clientY);
    }

    const touchMove = (e: TouchEvent) => {
        if (e.touches.length != 1) {
            return;
        }
        if (state.dragging) {
            dragMove(e.touches[0].clientX, e.touches[0].clientY);
        } else if (state.resizing) {
            resizeMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    const touchEnd = (e: TouchEvent) => {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    const touchCancel = (e: TouchEvent) => {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    const onEditClick = (e: any) => {
        e?.preventDefault?.();

        batch(() => {
            setState("dragging", false);
            setState("resizing", false);
        });

        props.onEdit?.();
    }

    const funcs: IPassDraggableFunctions = {
        mouseDown,
        touchStart,
    }

    return (
        <div
            ref={dialog}
            draggable={false}
            class="user-img-holder"
            style={"top: " + state.y + "px; left: " + state.x + "px;" + ` transform: rotate(${props.rotation ?? 0}deg)`}>
            <div class="content">
                {props.renderChild(props, state, funcs)}
                <Show when={props.onEdit != null}>
                    <div class="edit-handle show-on-hover" onClick={onEditClick}>
                        <span>📝</span>
                    </div>
                </Show>
                <div class="delete-handle show-on-hover" onClick={props.onDelete}>
                    <span>🗑️</span>
                </div>
                <div
                    class="resize-handle show-on-hover"
                    onMouseDown={mouseDownResizeCorner}
                    onTouchStart={touchStartResizeCorner}
                >
                    <img
                        src="/assets/img/handle.svg"
                        width="36" height="36"
                        onMouseDown={e => { e.preventDefault(); e.returnValue = false; }}
                    />
                </div>
            </div>
        </div>
    );
}

