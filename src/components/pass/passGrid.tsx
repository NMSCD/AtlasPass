import { Box } from '@hope-ui/solid';
import { Component, For } from 'solid-js';

interface IPassGridProps {
    gridRef: any;
    isPortrait: boolean;
    gridSnapPoints: number;
}

export const PassGrid: Component<IPassGridProps> = (props: IPassGridProps) => {

    const divRows = (gridSnapPoints: number, offsetHeight?: number) =>
        Math.round((offsetHeight ?? 700) / gridSnapPoints);
    const divCols = (gridSnapPoints: number, offsetWidth?: number) =>
        Math.round((offsetWidth ?? 700) / gridSnapPoints);

    return (
        <Box class="pass-grid-wrapper" style={`--grid-snap-point: ${props.gridSnapPoints}px;`}>
            <Box
                class="pass-grid"
                data-rows={divRows(props.gridSnapPoints, props.gridRef?.offsetHeight)}
            >
                <For each={new Array(divRows(props.gridSnapPoints, props.gridRef?.offsetHeight))}>
                    {emptyObj => (<div class="grid-row"></div>)}
                </For>
            </Box>
            <Box
                class="pass-grid"
                data-cols={divCols(props.gridSnapPoints, props.gridRef?.offsetWidth)}
            >
                <For each={new Array(divCols(props.gridSnapPoints, props.gridRef?.offsetWidth))}>
                    {emptyObj => (<div class="grid-col"></div>)}
                </For>
            </Box>
        </Box>
    );
}