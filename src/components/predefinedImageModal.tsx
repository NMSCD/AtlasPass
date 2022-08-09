import { Button, Center, createDisclosure, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, ResponsiveValue, SimpleGrid } from '@hope-ui/solid';
import { For, JSX } from 'solid-js';

interface IPredefinedImageModalProps<T> {
    buttonText: string;
    images: Array<T>;
    gridColumns?: ResponsiveValue<number>;
    minChildWidth?: any;
    gap?: any;
    onImageSelect: (imgPath: T) => void;
    imageRenderer: (item: T) => JSX.Element;
}

export function PredefinedImageModal<T>(props: IPredefinedImageModalProps<T>) {
    const { isOpen, onOpen, onClose } = createDisclosure();

    const onImageClick = (imgObj: T) => () => {
        props.onImageSelect(imgObj);
        onClose();
    }

    return (
        <>
            <Button variant="outline" onClick={onOpen}>{props.buttonText}</Button>
            <Modal size="full" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Image selection</ModalHeader>
                    <ModalBody>
                        <SimpleGrid
                            minChildWidth={props.minChildWidth}
                            columns={props.gridColumns}
                            gap={props.gap}
                        >
                            <For each={props.images}>
                                {(imgObj: T) => (
                                    <Center
                                        class="modal-select"
                                        onClick={onImageClick(imgObj)}
                                    >
                                        {props.imageRenderer(imgObj)}
                                    </Center>
                                )}
                            </For>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
