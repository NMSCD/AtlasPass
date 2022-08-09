import { Box } from '@hope-ui/solid';
import { Component, For } from 'solid-js';

interface IPassGridProps {
    gridRef: any;
    isPortrait: boolean;
    gridSnapPoints: number;
}

export const PassGrid: Component<IPassGridProps> = (props: IPassGridProps) => {

    const divRows = Math.round((props.gridRef?.offsetHeight ?? 700) / props.gridSnapPoints);
    const divCols = Math.round((props.gridRef?.offsetWidth ?? 700) / props.gridSnapPoints);

    return (
        <Box class="pass-grid-wrapper" style={`--grid-snap-point: ${props.gridSnapPoints}px;`}>
            <Box class="pass-grid" data-cols={divCols}>
                <For each={new Array(divCols)}>
                    {emptyObj => (<div class="grid-col"></div>)}
                </For>
            </Box>
            <Box class="pass-grid" data-rows={divRows}>
                <For each={new Array(divRows)}>
                    {emptyObj => (<div class="grid-row"></div>)}
                </For>
            </Box>
        </Box>
    );
}