import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box, Button, Center, Checkbox, Flex, FormControl, FormLabel, Input, Select,
    SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue, Spacer, Text
} from '@hope-ui/solid';
// import html2canvas from 'html2canvas';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { PassBackground } from '../components/pass/passBackground';
import { PassImage } from '../components/pass/passImage';
import { builtInBackgrounds } from '../constants/background';
import domtoimage from 'dom-to-image';


export const BuilderPage: Component = () => {
    const [useCustomBackgroundImage, setUseCustomBackgroundImage] = createSignal(false);
    const [backgroundImage, setBackgroundImage] = createSignal(builtInBackgrounds[0].imgUrl);
    const [backgroundImageOpacity, setBackgroundImageOpacity] = createSignal(0.7);

    // const [userImage, setUserImage] = createSignal({} a);
    const [userImages, setUserImages] = createSignal<Array<any>>([]);

    const onSelectUserImage = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objUrls: Array<any> = [];
        for (const file of event.target.files) {
            objUrls.push(URL.createObjectURL(file));
        }
        setUserImages((prev) => [...prev, ...objUrls]);
        event.target.value = null;
    }

    const download = async () => {
        const dataUrl = await domtoimage.toPng(document.querySelector(".pass-container")!);
        const link = document.createElement('a');
        link.download = 'filename.png';
        link.href = dataUrl;
        link.click();
        link.remove();
    }

    onCleanup(() => {
        userImages().map(objectUrl => URL.revokeObjectURL(objectUrl));
    });

    return (
        <Flex minH="80vh">
            <Box flex="1">
                <Center>
                    <Box class="pass-container" onDragOver={(ev: any) => ev?.preventDefault?.()}>
                        <PassBackground
                            backgroundImage={backgroundImage()}
                            backgroundImageOpacity={backgroundImageOpacity()}
                        />
                        <For each={userImages()}>
                            {imgUrl => (<PassImage src={imgUrl} />)}
                        </For>
                    </Box>
                </Center>
            </Box>
            <Box w="25vw" backgroundColor="rgba(0, 0, 0, 0.05)">
                <Accordion allowMultiple>
                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Background</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <Checkbox
                                id="useCustomBackgroundImage"
                                checked={useCustomBackgroundImage()}
                                onChange={() => setUseCustomBackgroundImage((prev) => !prev)}
                            >Use custom background image</Checkbox>

                            <Show when={useCustomBackgroundImage() == false}>
                                <FormControl mt="0.5em">
                                    <FormLabel for="backgroundImage">Background Image</FormLabel>
                                    <Select
                                        id="backgroundImage"
                                        value={backgroundImage()}
                                        onChange={(imgUrl) => setBackgroundImage(imgUrl)}
                                    >
                                        <SelectTrigger>
                                            <SelectPlaceholder>Background image</SelectPlaceholder>
                                            <SelectValue />
                                            <SelectIcon />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectListbox>
                                                <For each={builtInBackgrounds}>
                                                    {item => (
                                                        <SelectOption value={item.imgUrl}>
                                                            <SelectOptionText>{item.name}</SelectOptionText>
                                                            <SelectOptionIndicator />
                                                        </SelectOption>
                                                    )}
                                                </For>
                                            </SelectListbox>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </Show>

                            <Show when={useCustomBackgroundImage()}>
                                <FormControl mt="0.5em">
                                    <FormLabel for="customBackgroundImage">Custom Background Image</FormLabel>
                                    <Input
                                        id="customBackgroundImage"
                                        placeholder="Background image"
                                        type="file"
                                    />
                                </FormControl>
                            </Show>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Images</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <FormControl>
                                <FormLabel for="addCustomImage">Add custom image</FormLabel>
                                <Input
                                    id="addCustomImage"
                                    placeholder="Custom image"
                                    onChange={onSelectUserImage}
                                    type="file"
                                />
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <Button onClick={download}>Download</Button>
            </Box>
        </Flex>
    );
};
