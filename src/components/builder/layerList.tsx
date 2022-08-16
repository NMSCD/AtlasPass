import { Box, Flex, Image, Tooltip } from '@hope-ui/solid';
import classNames from 'classnames';
import { Component, For, Show } from 'solid-js';
import { UserUpload } from '../../contracts/userUpload';
import { getAllElementsTemplateData } from '../../helper/documentHelper';

export interface ILayerListProps {
    indexChangeRefreshCounter: number;
    userUploads: Array<UserUpload<any>>;
    selectedElement?: string;
    selectItem: (uuid?: string) => void;
    editElementName: (uuid: string, type: string, name: string) => () => void;
    duplicateItem: (uuid: string, type: string) => () => void;
    deleteItem: (uuid: string, type: string) => () => void;
}

export const LayerList: Component<ILayerListProps> = (props: ILayerListProps) => {

    const getOrderFromMap = (uuid: string, _: number): string => {
        const allJsonItems = getAllElementsTemplateData();
        for (const jsonItem of allJsonItems) {
            if (jsonItem.uuid != uuid) continue;

            return jsonItem.templateData.zIndex.toString();
        }
        return '1';
    }

    const triggerEdit = (uuid: string) => () => {
        const editOnSpecificItem: any = document.querySelector('#id' + uuid + ' .edit-handle');
        editOnSpecificItem?.click?.();
    }

    const selectElement = (uuid: string) => () => {
        if (props.selectedElement == uuid) {
            props.selectItem();
        }
        else {
            props.selectItem(uuid);
        }
    }

    return (
        <Flex id={`layer-list-${props.indexChangeRefreshCounter}`} flexDirection="column-reverse">
            <For each={props.userUploads}>
                {(userUpload: UserUpload<any>) => (
                    <Flex mt="0.5em" mb="0.5em" order={getOrderFromMap(userUpload.uuid, props.indexChangeRefreshCounter)}>
                        <Tooltip label="Click to highlight item" placement="top">
                            <Box
                                width="1.5em"
                                class={classNames('layer-img', 'pointer', { 'is-selected': props.selectedElement === userUpload.uuid })}
                                onClick={selectElement(userUpload.uuid)}
                                onDblClick={triggerEdit(userUpload.uuid)}
                            >
                                <Show when={userUpload.url != null || userUpload.data != null} fallback={<span>✏️</span>}>
                                    <Image src={(userUpload.url ?? userUpload.data)!} width="1.5em" height="1.5em" alt={userUpload.uuid} />
                                </Show>
                            </Box>
                        </Tooltip>
                        <Tooltip label="click to edit name" placement="top">
                            <Box flex="1" class="max-lines-1 pointer" pl="0.5em" onClick={props.editElementName(userUpload.uuid, userUpload.type, userUpload.name)}>
                                {userUpload.name ?? 'Unknown'}
                            </Box>
                        </Tooltip>
                        <Box width="4.5em">
                            <Tooltip label="Duplicate" placement="left"><span class="pointer" onClick={props.duplicateItem(userUpload.uuid, userUpload.type)}>✌</span></Tooltip>
                            &nbsp;&nbsp;
                            <Tooltip label="Open Edit menu" placement="left"><span class="pointer" onClick={triggerEdit(userUpload.uuid)}>📝</span></Tooltip>
                            &nbsp;
                            <Tooltip label="Delete" placement="left"><span class="pointer" onClick={props.deleteItem(userUpload.uuid, userUpload.type)}>🗑️</span></Tooltip>
                        </Box>
                    </Flex>
                )}
            </For>
        </Flex>
    );
}