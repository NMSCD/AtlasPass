import { Button, Center, createDisclosure, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text } from '@hope-ui/solid';
import { Component, For } from 'solid-js';
import { allTemplates, TemplateBuilder } from '../constants/templates';

export interface ILoadTemplateModalProps {
    setTemplate: (template: TemplateBuilder) => void;
}

export const LoadTemplateModal: Component<ILoadTemplateModalProps> = (props: ILoadTemplateModalProps) => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    const onImageClick = (template: TemplateBuilder) => () => {
        props.setTemplate(template);
        onClose();
    }

    return (
        <>
            <Button variant="outline" onClick={onOpen}>Add from selection</Button>
            <Modal size="full" opened={isOpen()} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Template selection</ModalHeader>
                    <ModalBody>
                        <Flex gap="$10" justifyContent="center">
                            <For each={allTemplates}>
                                {template => (
                                    <Center class="modal-select" maxH="10em" maxW="10em" flexDirection="column">
                                        <Image
                                            p="1em"
                                            src={template.imgUrl}
                                            class="predefined-img"
                                            alt={template.name}
                                            onClick={onImageClick(template)}
                                        />
                                        <Text>{template.name}</Text>
                                    </Center>
                                )}
                            </For>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
