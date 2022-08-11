import { Box, Button, Checkbox, createDisclosure, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@hope-ui/solid';
import { Component, createMemo, createSignal, JSX } from 'solid-js';
import { UserUploadTypes } from '../../contracts/userUpload';
import { anyObject } from '../../helper/typescriptHacks';
import { ItemIndexFormControl } from './common/itemIndexFormControl';
import { ItemRotationFormControl } from './common/itemRotationFormControl';
import { IPassDraggableFunctions, IPassDraggablePositionProps, IPassDraggableProps, IPassDraggableState, IPassDraggableTemplateProps, PassDraggable } from './passDraggable';

export interface IPassImageTemplateProps extends IPassDraggablePositionProps {
    rotation?: number;
    zIndex?: number;
    isCenterHorizontally?: boolean;
    isCenterVertically?: boolean;
}

interface IPassImageProps {
    src: string;
    uuid: string;
    name?: string;
    gridWidth: number;
    gridHeight: number;
    isSelected: boolean;
    enableGridSnap: boolean;
    gridSnapPoints: number;
    templateData?: IPassImageTemplateProps;
    onDelete: () => void;
    onZIndexChange: () => void;
}

export const PassImage: Component<IPassImageProps> = (props: IPassImageProps) => {
    const {
        rotation: templRotation = 0,
        zIndex: templZIndex = 1,
        isCenterHorizontally = false,
        isCenterVertically = false,
    } = props.templateData ?? anyObject;

    const { isOpen, onOpen, onClose } = createDisclosure();

    const [rotation, setRotation] = createSignal(templRotation);
    const [zIndex, setZIndex] = createSignal(templZIndex);
    const [horizontalFlip, setHorizontalFlip] = createSignal(false);
    const [verticalFlip, setVerticalFlip] = createSignal(false);
    const [centerHorizontally, setCenterHorizontally] = createSignal(isCenterHorizontally);
    const [centerVertically, setCenterVertically] = createSignal(isCenterVertically);

    const renderImage = (
        draggableProps: IPassDraggableProps,
        draggableState: IPassDraggableState,
        draggableFunctions: IPassDraggableFunctions
    ): JSX.Element => {

        let styleWidth = createMemo(() => {
            if (draggableState.width != undefined && draggableState.width > 0) {
                return draggableState.width + 'px';
            } else {
                return '100px';
            }
        });

        let styleHeight = createMemo(() => {
            if (draggableState.height != undefined && draggableState.height > 0) {
                return draggableState.height + 'px';
            } else {
                return '100px';
            }
        });

        return (
            <img
                class="user-img"
                src={props.src}
                draggable={true}
                onMouseDown={draggableFunctions.mouseDown}
                onTouchStart={draggableFunctions.touchStart}
                ondragstart={(ev) => ev?.preventDefault?.()}
                style={{
                    'width': styleWidth(),
                    'height': styleHeight(),
                    'transform': `scaleX(${horizontalFlip() ? '-1' : '1'}) scaleY(${verticalFlip() ? '-1' : '1'})`
                }}
            />
        );
    }

    const onSetZIndex = (newValue: number) => {
        setZIndex(newValue);
        props.onZIndexChange();
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
                    url: props.src,
                    templateData: {
                        rotation: rotation(),
                        zIndex: zIndex(),
                        horizontalFlip: horizontalFlip(),
                        verticalFlip: verticalFlip(),
                    }
                }}
                renderChild={renderImage}
                onEdit={onOpen}
            />

            <Modal opened={isOpen()} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent class="noselect">
                    <ModalCloseButton />
                    <ModalHeader>Image options</ModalHeader>
                    <ModalBody>
                        <Flex>
                            <ItemRotationFormControl
                                flex="6" mt="0.5em" mb="0.5em"
                                setRotation={setRotation}
                                rotation={rotation}
                            />
                            <Box width="15px"></Box>
                            <ItemIndexFormControl
                                flex="2" mt="0.5em" mb="0.5em"
                                setZIndex={onSetZIndex}
                                zIndexValue={zIndex}
                            />
                        </Flex>
                        <Flex>
                            <Checkbox
                                mt="0.5em"
                                checked={horizontalFlip()}
                                onChange={() => setHorizontalFlip((prev) => !prev)}
                            >Flip Horizontal</Checkbox>
                            <Box width="15px"></Box>
                            <Checkbox
                                mt="0.5em"
                                checked={verticalFlip()}
                                onChange={() => setVerticalFlip((prev) => !prev)}
                            >Flip Vertical</Checkbox>
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

