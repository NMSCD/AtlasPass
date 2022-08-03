import { Box, Button, createDisclosure, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue, Spacer } from '@hope-ui/solid';
import { Component, createMemo, createSignal, For, JSX } from 'solid-js';
import { builtInFonts } from '../../constants/fonts';
import { IPassDraggableFunctions, IPassDraggableProps, IPassDraggableState, PassDraggable } from './passDraggable';

interface IPassTextProps {
    initX?: number;
    initY?: number;
    onDelete: () => void;
}

export const PassText: Component<IPassTextProps> = (props: IPassTextProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    const [displayText, setDisplayText] = createSignal('This is some text');
    const [fontFamily, setFontFamily] = createSignal(builtInFonts[0].fontFamily);
    const [fontSize, setFontSize] = createSignal(20);
    const [fontColour, setFontColour] = createSignal('#FFFFFF');
    const [fontRotation, setFontRotation] = createSignal(0);

    const renderText = (
        draggableProps: IPassDraggableProps,
        draggableState: IPassDraggableState,
        draggableFunctions: IPassDraggableFunctions
    ): JSX.Element => {

        let styleWidth = createMemo(() => {
            if (draggableState.width != undefined && draggableState.width > 0) {
                return " width: " + draggableState.width + "px;";
            } else {
                return " width: 300px;";
            }
        });

        let styleHeight = createMemo(() => {
            if (draggableState.height != undefined && draggableState.height > 0) {
                return " height: " + draggableState.height + "px;";
            } else {
                return " height: 200px;";
            }
        });

        return (
            <div
                draggable={true}
                onMouseDown={draggableFunctions.mouseDown}
                onTouchStart={draggableFunctions.touchStart}
                ondragstart={(ev) => ev?.preventDefault?.()}
                class="text-container noselect"
                style={styleWidth() + styleHeight()}
            >
                <span style={{
                    "font-family": fontFamily(),
                    "font-size": fontSize() + 'px',
                    "color": fontColour(),
                }}>
                    {displayText}
                </span>
            </div>
        );
    }

    return (
        <>
            <PassDraggable
                {...props}
                rotation={fontRotation()}
                renderChild={renderText}
                onEdit={onOpen}
            />

            <Modal opened={isOpen()} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent class="noselect">
                    <ModalCloseButton />
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalBody>
                        <FormControl mt="0.5em" mb="0.5em">
                            <FormLabel for="text-to-display">Text to display</FormLabel>
                            <Input
                                id="text-to-display"
                                onInput={(e: any) => setDisplayText(e?.target?.value ?? '')}
                                value={displayText()}
                            />
                        </FormControl>
                        <Flex>
                            <FormControl flex="6" mt="0.5em" mb="0.5em">
                                <FormLabel for="text-font">Font</FormLabel>
                                <Select
                                    id="text-font"
                                    value={fontFamily()}
                                    onChange={(font) => setFontFamily(font)}
                                >
                                    <SelectTrigger>
                                        <SelectPlaceholder>Font</SelectPlaceholder>
                                        <SelectValue />
                                        <SelectIcon />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectListbox>
                                            <For each={builtInFonts}>
                                                {item => (
                                                    <SelectOption value={item.fontFamily}>
                                                        <SelectOptionText>{item.name}</SelectOptionText>
                                                        <SelectOptionIndicator />
                                                    </SelectOption>
                                                )}
                                            </For>
                                        </SelectListbox>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <Box width="15px"></Box>
                            <FormControl flex="2" mt="0.5em" mb="0.5em">
                                <FormLabel for="text-font-size">Font size</FormLabel>
                                <Input
                                    id="text-to-display"
                                    onInput={(e: any) => setFontSize(e?.target?.value ?? 20)}
                                    value={fontSize()}
                                    type="number"
                                />
                            </FormControl>
                        </Flex>
                        <Flex>
                            <FormControl flex="6" mt="0.5em" mb="0.5em">
                                <FormLabel for="font-rotation">Rotation</FormLabel>
                                <Input
                                    id="font-rotation"
                                    onInput={(e: any) => setFontRotation((e?.target?.value ?? 0))}
                                    value={fontRotation()}
                                    min="0"
                                    max="360"
                                    type="range"
                                />
                            </FormControl>
                            <Box width="15px"></Box>
                            <FormControl flex="2" mt="0.5em" mb="0.5em">
                                <FormLabel for="text-font-size">Font colour</FormLabel>
                                <Input
                                    id="text-to-display"
                                    onInput={(e: any) => setFontColour(e?.target?.value ?? '#FFFFFF')}
                                    value={fontColour()}
                                    type="color"
                                />
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
