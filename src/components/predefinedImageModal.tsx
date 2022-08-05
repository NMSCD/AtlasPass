import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box, Button, Center, Checkbox, createDisclosure, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select,
    SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue, SimpleGrid, Text, VStack
} from '@hope-ui/solid';
import domtoimage from 'dom-to-image';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { PassBackground } from '../components/pass/passBackground';
import { PassImage } from '../components/pass/passImage';
import { PassText } from '../components/pass/passText';
import { builtInBackgrounds, imageFilter } from '../constants/background';
import { PromoteType } from '../constants/enum/promoteType';
import { assistantNMSWatermark, baseImages, nmscdWatermark, predefinedImages, predefinedPath } from '../constants/images';
import { UserUpload } from '../contracts/userUpload';
import { downloadFile } from '../helper/fileHelper';

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
                                        <img src={props.imagePath(imgStr)} alt={imgStr} onClick={onImageClick(imgStr)} />
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
