import { FormControl, FormControlProps, FormLabel, Input, Tooltip } from '@hope-ui/solid';
import { Component } from 'solid-js';

interface IItemRotationProps extends FormControlProps {
    defaultValue?: number;
    rotation: () => number;
    setRotation: (newValue: number) => void;
}

export const ItemRotationFormControl: Component<IItemRotationProps> = (props: IItemRotationProps) => {
    const defaultValue = props.defaultValue ?? 1;
    return (
        <FormControl {...props}>
            <FormLabel for="font-rotation">Rotation ({props.rotation()}°)</FormLabel>
            <Input
                id="font-rotation"
                onInput={(e: any) => props.setRotation((e?.target?.value ?? defaultValue))}
                value={props.rotation()}
                min="0"
                max="360"
                step="1"
                type="range"
            />
        </FormControl>
    );
};
