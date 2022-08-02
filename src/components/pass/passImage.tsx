import { createStore } from 'solid-js/store';
import { batch, Component, createMemo, onCleanup, onMount } from 'solid-js';

interface PassImageProps {
    src: string;
    initX?: number;
    initY?: number;
}

export const PassImage: Component<PassImageProps> = (props: PassImageProps) => {

    var parent: any;
    var dialog: any;

    var initX = props.hasOwnProperty("initX") ? props.initX : 0;
    var initY = props.hasOwnProperty("initY") ? props.initY : 0;
    const [state, setState] = createStore({
        dragging: false,
        resizing: false,
        x: initX,
        y: initY
    } as {
        dragging: boolean,
        resizing: boolean,
        startOffsetX?: number,
        startOffsetY?: number,
        x: number,
        y: number,
        width?: number,
        height?: number
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

    function dragStart(x: number, y: number) {
        batch(() => {
            setState("dragging", true);
            setState("startOffsetX", x - state.x);
            setState("startOffsetY", y - state.y);
        });
    }

    function dragMove(x: number, y: number) {
        if (!state.dragging) {
            return;
        }
        batch(() => {
            setState("x", x - (state.startOffsetX ?? 0));
            setState("y", y - (state.startOffsetY ?? 0));
        });
    }

    function dragEnd() {
        if (!state.dragging) {
            return;
        }
        batch(() => {
            setState("dragging", false);
            setState("startOffsetX", undefined);
            setState("startOffsetY", undefined);
        });
    }

    function resizeStart(x: number, y: number) {
        batch(() => {
            setState("resizing", true);
            setState("startOffsetX", x - (state.x + (state.width ?? 0)));
            setState("startOffsetY", y - (state.y + (state.height ?? 0)));
        });
    }

    function resizeMove(x: number, y: number) {
        batch(() => {
            setState("width", x - (state.startOffsetX ?? 0) - state.x);
            setState("height", y - (state.startOffsetY ?? 0) - state.y);
        });
    }

    function resizeEnd() {
        batch(() => {
            setState("resizing", false);
            setState("startOffsetX", undefined);
            setState("startOffsetY", undefined);
        });
    }

    function mouseDown(e: MouseEvent) {
        dragStart(e.clientX, e.clientY);
    }

    function mouseDownResizeCorner(e: MouseEvent) {
        resizeStart(e.clientX, e.clientY);
    }

    function mouseMove(e: MouseEvent) {
        if (state.dragging) {
            dragMove(e.clientX, e.clientY);
        } else if (state.resizing) {
            resizeMove(e.clientX, e.clientY);
        }
    }

    function mouseUp(e: MouseEvent) {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    function mouseLeave(e: MouseEvent) {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    function touchStart(e: TouchEvent) {
        if (e.touches.length != 1) {
            return;
        }
        dragStart(e.touches[0].clientX, e.touches[0].clientY);
    }

    function touchStartResizeCorner(e: TouchEvent) {
        if (e.touches.length != 1) {
            return;
        }
        resizeStart(e.touches[0].clientX, e.touches[0].clientY);
    }

    function touchMove(e: TouchEvent) {
        if (e.touches.length != 1) {
            return;
        }
        if (state.dragging) {
            dragMove(e.touches[0].clientX, e.touches[0].clientY);
        } else if (state.resizing) {
            resizeMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }

    function touchEnd(e: TouchEvent) {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    function touchCancel(e: TouchEvent) {
        if (state.dragging) {
            dragEnd();
        } else if (state.resizing) {
            resizeEnd();
        }
    }

    let styleWidth = createMemo(() => {
        if (state.width != undefined && state.width > 0) {
            return " width: " + state.width + "px;";
        } else {
            return " width: 100px;";
        }
    });

    let styleHeight = createMemo(() => {
        if (state.height != undefined && state.height > 0) {
            return " height: " + state.height + "px;";
        } else {
            return " height: 100px;";
        }
    });


    return (
        <div
            ref={dialog}
            draggable={true}
            class="user-img-holder"
            style={"top: " + state.y + "px; left: " + state.x + "px;"}>
            <div class="content">
                <img
                    class="user-img"
                    src={props.src}
                    draggable={true}
                    onMouseDown={mouseDown}
                    onTouchStart={touchStart}
                    ondragstart={(ev) => ev?.preventDefault?.()}
                    style={styleWidth() + styleHeight()}
                />
                <div class="resize-handle" onMouseDown={mouseDownResizeCorner} onTouchStart={touchStartResizeCorner}>
                    <img src="/assets/img/handle.svg" width="36" height="36" onMouseDown={e => { e.preventDefault(); e.returnValue = false; }} />
                </div>
            </div>
        </div>
    );
}

