import { FormLabel, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue } from '@hope-ui/solid';
import { Component, For } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { DropDownOption } from '../../contracts/dropDownOption';

interface IDropDownProps {
    label: string;
    placeholder: string;
    options: Array<DropDownOption>;
    value: () => string;
    setValue: (newValue: string) => void;
}

export const SimpleDropDown: Component<IDropDownProps> = (props: IDropDownProps) => {
    const dropdownId = 'simple-dropdown-' + uuidv4().substring(0, 6).toLowerCase();
    return (
        <>
            <FormLabel for={dropdownId}>{props.label}</FormLabel>
            <Select
                id={dropdownId}
                value={props.value()}
                onChange={(ddValue) => props.setValue(ddValue)}
            >
                <SelectTrigger>
                    <SelectPlaceholder>{props.placeholder ?? 'Select a value'}</SelectPlaceholder>
                    <SelectValue />
                    <SelectIcon />
                </SelectTrigger>
                <SelectContent>
                    <SelectListbox>
                        <For each={props.options}>
                            {dropDownOpt => (
                                <SelectOption value={dropDownOpt.value}>
                                    <SelectOptionText>{dropDownOpt.name}</SelectOptionText>
                                    <SelectOptionIndicator />
                                </SelectOption>
                            )}
                        </For>
                    </SelectListbox>
                </SelectContent>
            </Select>
        </>
    );
};
