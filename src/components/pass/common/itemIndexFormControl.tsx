import { FormControl, FormControlProps, FormLabel, Input, Tooltip } from '@hope-ui/solid';
import { Component } from 'solid-js';

interface IItemIndexProps extends FormControlProps {
    defaultValue?: number;
    zIndexValue: () => number;
    setZIndex: (newValue: number) => void;
}

export const ItemIndexFormControl: Component<IItemIndexProps> = (props: IItemIndexProps) => {
    const defaultValue = props.defaultValue ?? 1;
    return (
        <FormControl {...props}>
            <Tooltip label="The lower the number, the further back an item is">
                <FormLabel for="text-z-index">Layer position (?)</FormLabel>
            </Tooltip>
            <Input
                id="text-z-index"
                onInput={(e: any) => props.setZIndex(e?.target?.value ?? defaultValue)}
                value={props.zIndexValue()}
                type="number"
                min="0"
            />
        </FormControl>
    );
};
