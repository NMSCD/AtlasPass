import { Button, Center, createDisclosure, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid } from '@hope-ui/solid';
import { Component, For } from 'solid-js';

interface IPredefinedImageModalProps {
    images: Array<string>;
    imagePath: (imgStr: string) => string;
    onImageSelect: (imgPath: string) => void;
}

export const PredefinedImageModal: Component<IPredefinedImageModalProps> = (props: IPredefinedImageModalProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    const onImageClick = (imgStr: string) => () => {
        const fullPath = props.imagePath(imgStr);
        props.onImageSelect(fullPath);
        onClose();
    }

    return (
        <>
            <Button variant="outline" onClick={onOpen}>Add from selection</Button>
            <Modal size="full" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Image selection</ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={16} gap="$10">
                            <For each={props.images}>
                                {imgStr => (
                                    <Center maxH="10em" maxW="10em">
                                        <Image
                                            src={props.imagePath(imgStr)} alt={imgStr}
                                            class="predefined-img"
                                            onClick={onImageClick(imgStr)}
                                        />
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
