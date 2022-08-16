import { Box, Button, Checkbox, createDisclosure, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@hope-ui/solid';
import { Component, createMemo, createSignal, JSX } from 'solid-js';
import { builtInFonts, textAlignOptions } from '../../constants/fonts';
import { UserUploadTypes } from '../../contracts/userUpload';
import { anyObject } from '../../helper/typescriptHacks';
import { SimpleDropDown } from '../common/dropdown';
import { ItemIndexFormControl } from './common/itemIndexFormControl';
import { ItemRotationFormControl } from './common/itemRotationFormControl';
import { IPassDraggableFunctions, IPassDraggablePositionProps, IPassDraggableProps, IPassDraggableState, IPassDraggableTemplateProps, PassDraggable } from './passDraggable';

export interface IPassTextTemplateProps extends IPassDraggablePositionProps {
    displayText?: string;
    fontFamily?: string;
    fontSize?: number;
    fontColour?: string;
    fontRotation?: number;
    fontAlign?: string;
    zIndex?: number;
    isCenterHorizontally?: boolean;
    isCenterVertically?: boolean;
}

interface IPassTextProps {
    uuid: string;
    name?: string;
    gridWidth: number;
    gridHeight: number;
    isSelected: boolean;
    enableGridSnap: boolean;
    gridSnapPoints: number;
    templateData?: IPassTextTemplateProps;
    onDelete: () => void;
}

export const PassText: Component<IPassTextProps> = (props: IPassTextProps) => {
    const {
        displayText: templDisplayText = 'This is some text',
        fontFamily: templFontFamily = builtInFonts[0].fontFamily,
        fontSize: templFontSize = 20,
        fontColour: templFontColour = '#FFFFFF',
        fontRotation: templFontRotation = 0,
        fontAlign: templFontAlign = textAlignOptions[0].value,
        zIndex: templZIndex = 1,
        isCenterHorizontally = false,
        isCenterVertically = false,
    } = props.templateData ?? anyObject;

    const { isOpen, onOpen, onClose } = createDisclosure();

    const [displayText, setDisplayText] = createSignal(templDisplayText);
    const [fontFamily, setFontFamily] = createSignal(templFontFamily);
    const [fontSize, setFontSize] = createSignal(templFontSize);
    const [fontColour, setFontColour] = createSignal(templFontColour);
    const [rotation, setFontRotation] = createSignal(templFontRotation);
    const [fontAlign, setFontAlign] = createSignal(templFontAlign);
    const [zIndex, setZIndex] = createSignal(templZIndex);
    const [centerHorizontally, setCenterHorizontally] = createSignal(isCenterHorizontally);
    const [centerVertically, setCenterVertically] = createSignal(isCenterVertically);

    const onFontFamilyChange = (fontFamily: string) => {
        setFontFamily(fontFamily);
        const fontObj = builtInFonts.find(bf => bf.fontFamily == fontFamily);
        if (fontObj?.allowedChars == null) return;

        setDisplayText((text) =>
            onlyAllowedChars(text, fontObj.allowedChars!).substring(0, fontObj.maxChars).toUpperCase()
        );
    }

    const onTextEdit = (e: any) => {
        const fontObj = builtInFonts.find(bf => bf.fontFamily == fontFamily());

        const text = e?.target?.value ?? '';
        if (fontObj?.allowedChars == null) {
            setDisplayText(text);
            return;
        }

        const newText = onlyAllowedChars(text, fontObj.allowedChars!).substring(0, fontObj.maxChars).toUpperCase();
        e.target.value = newText;
        setDisplayText(newText);
    }

    const onlyAllowedChars = (text: string, allowedChars: Array<string>) => text
        .split('')
        .filter((t: string) => allowedChars.includes(t.toLowerCase()))
        .join('');

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
                <p style={{
                    'font-family': fontFamily(),
                    'font-size': fontSize() + 'px',
                    'text-align': fontAlign(),
                    'color': fontColour(),
                }}>
                    {displayText}
                </p>
            </div>
        );
    }

    return (
        <>
            <PassDraggable
                {...props}
                {...props.templateData}
                isCenterHorizontally={centerHorizontally()}
                isCenterVertically={centerVertically()}
                partialTemplateData={{
                    uuid: props.uuid,
                    name: props.name,
                    type: UserUploadTypes.img,
                    templateData: {
                        displayText: displayText(),
                        fontFamily: fontFamily(),
                        fontSize: fontSize(),
                        fontColour: fontColour(),
                        fontAlign: fontAlign(),
                        rotation: rotation(),
                        zIndex: zIndex(),
                    }
                }}
                renderChild={renderText}
                onEdit={onOpen}
            />

            <Modal opened={isOpen()} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent class="noselect">
                    <ModalCloseButton />
                    <ModalHeader>Text options</ModalHeader>
                    <ModalBody>
                        <FormControl mt="0.5em" mb="0.5em" class={displayText()}>
                            <FormLabel for="text-to-display">Text to display</FormLabel>
                            <Input
                                id="text-to-display"
                                onInput={onTextEdit}
                                value={displayText()}
                            />
                        </FormControl>
                        <Flex>
                            <FormControl flex="6" mt="0.5em" mb="0.5em">
                                <SimpleDropDown
                                    label="Font"
                                    placeholder="Font"
                                    options={builtInFonts.map(f => ({ name: f.name, value: f.fontFamily }))}
                                    setValue={onFontFamilyChange}
                                    value={fontFamily}
                                />
                            </FormControl>
                            <Box width="15px"></Box>
                            <FormControl flex="2" mt="0.5em" mb="0.5em">
                                <FormLabel for="text-font-size">Font size (px)</FormLabel>
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
                                <SimpleDropDown
                                    label="Alignment"
                                    placeholder="Font Alignment"
                                    options={textAlignOptions}
                                    setValue={setFontAlign}
                                    value={fontAlign}
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
                        <Flex>
                            <ItemRotationFormControl
                                flex="6" mt="0.5em" mb="0.5em"
                                setRotation={setFontRotation}
                                rotation={rotation}
                            />
                            <Box width="15px"></Box>
                            <ItemIndexFormControl
                                flex="2" mt="0.5em" mb="0.5em"
                                setZIndex={setZIndex}
                                zIndexValue={zIndex}
                            />
                        </Flex>
                        <Flex>
                            <Checkbox
                                mt="0.5em"
                                checked={centerHorizontally()}
                                onChange={() => setCenterHorizontally((prev) => !prev)}
                            >Center Horizontally</Checkbox>
                            <Box width="15px"></Box>
                            <Checkbox
                                mt="0.5em"
                                checked={centerVertically()}
                                onChange={() => setCenterVertically((prev) => !prev)}
                            >Center Vertically</Checkbox>
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
