import { Box } from '@hope-ui/solid';
import { Component, For } from 'solid-js';

interface IPassGridProps {
    gridRef: any;
    gridSnapPoints: number;
}

export const PassGrid: Component<IPassGridProps> = (props: IPassGridProps) => {

    const getNumColRow = () => {
        const divCols = Math.round((props.gridRef?.offsetWidth ?? 700) / props.gridSnapPoints);
        const divRows = Math.round((props.gridRef?.offsetHeight ?? 700) / props.gridSnapPoints);
        return (divCols + 1) * (divRows + 1);
    }
    return (
        <Box class="pass-grid-wrapper" style={`--grid-snap-point: ${props.gridSnapPoints}px;`}>
            <Box class="pass-grid">
                <For each={new Array(getNumColRow())}>
                    {emptyObj => (<div class="grid-item"></div>)}
                </For>
            </Box>
        </Box>
    );
}