import { createStore } from 'solid-js/store';
import { batch, Component, createMemo, JSX, onCleanup, onMount, Show } from 'solid-js';
import classNames from 'classnames';

export interface IPassDraggableState {
    dragging: boolean,
    resizing: boolean,
    x: number,
    y: number,
    width?: number,
    height?: number,
    startOffsetX?: number,
    startOffsetY?: number,
}

export interface IPassDraggablePositionProps {
    initX?: number;
    initY?: number;
    initWidth?: number,
    initHeight?: number,
}

export interface IPassDraggableProps extends IPassDraggablePositionProps {
    isSelected?: boolean;
    rotation?: number;
    enableGridSnap: boolean;
    gridSnapPoints: number;
    zIndex?: number;
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

    let initX: number = (props.hasOwnProperty('initX') ? props.initX : 0) ?? 0;
    let initY: number = (props.hasOwnProperty('initY') ? props.initY : 0) ?? 0;
    const [state, setState] = createStore<IPassDraggableState>({
        dragging: false,
        resizing: false,
        x: initX,
        y: initY,
        width: props.initWidth,
        height: props.initHeight,
    });

    console.log('state', { ...state });

    onMount(() => {
        batch(() => {
            parent = dialog.parentNode;
            parent.addEventListener('mousemove', mouseMove, { passive: true });
            parent.addEventListener('mouseup', mouseUp);
            parent.addEventListener('mouseleave', mouseLeave);
            parent.addEventListener('touchmove', touchMove, { passive: true });
            parent.addEventListener('touchend', touchEnd);
            parent.addEventListener('touchcancel', touchCancel);
            let rect = dialog.getBoundingClientRect();
            setState('width', rect.width);
            setState('height', rect.height);
        });
    });

    onCleanup(() => {
        parent.removeEventListener('mousemove', mouseMove);
        parent.removeEventListener('mouseup', mouseUp);
        parent.removeEventListener('mouseleave', mouseLeave);
        parent.removeEventListener('touchmove', touchMove);
        parent.removeEventListener('touchend', touchEnd);
        parent.removeEventListener('touchcancel', touchCancel);
    });

    const dragStart = (x: number, y: number) => {
        const stateX = x - state.x;
        const stateY = y - state.y;
        batch(() => {
            setState('dragging', true);
            setState('startOffsetX', stateX);//props.enableGridSnap ? (Math.floor(stateX / props.gridSnapPoints) * props.gridSnapPoints) : stateX);
            setState('startOffsetY', stateY);//props.enableGridSnap ? (Math.floor(stateY / props.gridSnapPoints) * props.gridSnapPoints) : stateY);
        });
    }

    const dragMove = (x: number, y: number) => {
        if (!state.dragging) {
            return;
        }
        const stateX = x - (state.startOffsetX ?? 0);
        const stateY = y - (state.startOffsetY ?? 0);
        batch(() => {
            setState('x', props.enableGridSnap ? (Math.floor(stateX / props.gridSnapPoints) * props.gridSnapPoints) : stateX);
            setState('y', props.enableGridSnap ? (Math.floor(stateY / props.gridSnapPoints) * props.gridSnapPoints) : stateY);
        });
    }

    const dragEnd = () => {
        if (!state.dragging) {
            return;
        }
        batch(() => {
            setState('dragging', false);
            setState('startOffsetX', undefined);
            setState('startOffsetY', undefined);
        });
    }

    const resizeStart = (x: number, y: number) => {
        const stateX = x - (state.x + (state.width ?? 0));
        const stateY = y - (state.y + (state.height ?? 0));
        batch(() => {
            setState('resizing', true);
            setState('startOffsetX', props.enableGridSnap ? (Math.floor(stateX / props.gridSnapPoints) * props.gridSnapPoints) : stateX);
            setState('startOffsetY', props.enableGridSnap ? (Math.floor(stateY / props.gridSnapPoints) * props.gridSnapPoints) : stateY);
        });
    }

    const resizeMove = (x: number, y: number) => {
        const stateX = x - (state.startOffsetX ?? 0) - state.x;
        const stateY = y - (state.startOffsetY ?? 0) - state.y;
        batch(() => {
            setState('width', props.enableGridSnap ? (Math.floor(stateX / props.gridSnapPoints) * props.gridSnapPoints) : stateX);
            setState('height', props.enableGridSnap ? (Math.floor(stateY / props.gridSnapPoints) * props.gridSnapPoints) : stateY);
        });
    }

    const resizeEnd = () => {
        batch(() => {
            setState('resizing', false);
            setState('startOffsetX', undefined);
            setState('startOffsetY', undefined);
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
            setState('dragging', false);
            setState('resizing', false);
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
            class={classNames('user-img-holder', { 'is-selected': props.isSelected })}
            style={{
                top: state.y + 'px',
                left: state.x + 'px',
                'z-index': props.zIndex ?? 1,
                'min-width': (state.width ?? 0) + 'px',
                'min-height': (state.height ?? 0) + 'px',
                transform: `rotate(${props.rotation ?? 0}deg)`
            }}>
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

