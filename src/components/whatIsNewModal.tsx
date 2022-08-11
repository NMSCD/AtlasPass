import { Box, Button, createDisclosure, Divider, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Tag, Text, VStack } from '@hope-ui/solid';
import { createSignal, For, onMount, Show } from 'solid-js';
import { AssistantApps } from '../constants/assistantApps';
import { VersionViewModel } from '../contracts/generated/AssistantApps/ViewModel/Version/versionViewModel';
import { AssistantAppsApiService } from '../services/AssistantAppsApiService';

interface IWhatIsNewModalProps {
}

export function WhatIsNewModal(props: IWhatIsNewModalProps) {
    const { isOpen, onOpen, onClose } = createDisclosure();
    const [winItems, setWinItems] = createSignal<Array<VersionViewModel>>([]);

    onMount(async () => {
        console.log('WhatIsNewModal onMount');
        const service = new AssistantAppsApiService();
        const winItemsResult = await service.getWhatIsNewItems({
            appGuid: AssistantApps.appGuid,
            languageCode: 'en',
            page: 1,
            platforms: [],
        });

        if (winItemsResult.isSuccess == false) {
            return;
        }

        setWinItems(winItemsResult.value);
    });

    return (
        <>
            <Button variant="outline" onClick={onOpen}>Changelog</Button>
            <Modal scrollBehavior="inside" size="2xl" opened={isOpen()} onClose={onClose}>
                <ModalOverlay zIndex={1300} />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Changelog</ModalHeader>
                    <ModalBody>
                        <VStack>
                            <For each={winItems()}>
                                {(version: VersionViewModel) => (
                                    <Box class="win-item">
                                        <Text size="lg">{version.buildName}</Text>
                                        <Text class="win-date">{(new Date(version.activeDate)).toISOString().split('T')[0]}</Text>
                                        <Show when={version.guid === AssistantApps.whatIsNewGuid}>
                                            <Tag colorScheme="success">Current</Tag>
                                        </Show>
                                        <Divider mt="0.5em" mb="0.5em" />
                                        <Text>
                                            <pre>{version.markdown}</pre>
                                        </Text>
                                    </Box>
                                )}
                            </For>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
