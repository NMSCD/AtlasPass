import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box, Button, Center, Checkbox, classNames, Flex, FormControl, FormLabel, Input, Radio, RadioGroup, Select,
    SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue, Switch, Text, VStack
} from '@hope-ui/solid';
import domtoimage from 'dom-to-image';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { className } from 'solid-js/web';
import { v4 as uuidv4 } from 'uuid';
import { PassBackground } from '../components/pass/passBackground';
import { PassImage } from '../components/pass/passImage';
import { PassText } from '../components/pass/passText';
import { PredefinedImageModal } from '../components/predefinedImageModal';
import { builtInBackgrounds, imageFilter } from '../constants/background';
import { PromoteType } from '../constants/enum/promoteType';
import { assistantNMSWatermark, nmscdWatermark, predefinedImages, predefinedPath } from '../constants/images';
import { UserUpload } from '../contracts/userUpload';
import { downloadFile } from '../helper/fileHelper';


export const BuilderPage: Component = () => {
    const [useCustomBackgroundImage, setUseCustomBackgroundImage] = createSignal(false);
    const [isPortrait, setIsPortrait] = createSignal(false);
    const [backgroundImage, setBackgroundImage] = createSignal(builtInBackgrounds[0].imgUrl);
    const [backgroundImageOpacity, setBackgroundImageOpacity] = createSignal(70);

    // const [userImage, setUserImage] = createSignal({} a);
    const [userImages, setUserImages] = createSignal<Array<UserUpload>>([]);
    const [userTexts, setUserTexts] = createSignal<Array<UserUpload>>([]);

    const [promoteToShow, setPromoteToShow] = createSignal(PromoteType.none);

    const onSelectBackgroundImage = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        setBackgroundImage(URL.createObjectURL(event.target.files[0]));
        event.target.value = null;
    }

    const onSelectUserImage = (event: any) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objUrls: Array<UserUpload> = [];
        for (const file of event.target.files) {
            objUrls.push({
                uuid: uuidv4(),
                data: URL.createObjectURL(file),
            });
        }
        setUserImages((prev) => [...prev, ...objUrls]);
        event.target.value = null;
    }

    const onSelectPredefinedImage = (imgStr: string) => {
        const imgObj: UserUpload = {
            uuid: uuidv4(),
            url: imgStr,
        };
        setUserImages((prev) => [...prev, imgObj]);
    }

    const deleteUserImage = (uuid: string) => () => {
        setUserImages((prev: Array<UserUpload>) => {
            const newUserImagesArray: Array<UserUpload> = [];
            for (const userImg of prev) {
                if (userImg.uuid !== uuid) {
                    newUserImagesArray.push(userImg);
                } else {
                    URL.revokeObjectURL(userImg.data);
                }
            }
            return newUserImagesArray;
        });
    }

    const addUserText = () => {
        const newTextObj: UserUpload = {
            uuid: uuidv4(),
            data: '',
        };
        setUserTexts((prev) => [...prev, newTextObj]);
    }

    const download = async () => {
        const cardElem = document.querySelector(".pass-container-img")!;
        const dataUrl = await domtoimage.toPng(cardElem);
        downloadFile(dataUrl, uuidv4().substring(0, 6) + '.png');
    }

    onCleanup(() => {
        userImages()
            .filter(imgObj => imgObj.data != null)
            .map(imgObj => URL.revokeObjectURL(imgObj.data));
    });

    return (
        <Flex minH="80vh" class="noselect">
            <Box flex="1" overflow="hidden">
                <Center onDragOver={(ev: any) => ev?.preventDefault?.()}>
                    <Box class={classNames('pass-container', isPortrait() ? 'is-portrait' : '')}>
                        <div class="pass-container-img">
                            <PassBackground
                                backgroundImage={backgroundImage()}
                                backgroundImageOpacity={backgroundImageOpacity() / 100}
                            />
                            <For each={userImages()}>
                                {imgObj => (
                                    <PassImage src={imgObj.url ?? imgObj.data} onDelete={deleteUserImage(imgObj.uuid)} />
                                )}
                            </For>
                            <For each={userTexts()}>
                                {textObj => (
                                    <PassText onDelete={() => setUserTexts((prev: Array<UserUpload>) => prev.filter(t => t.uuid !== textObj.uuid))} />
                                )}
                            </For>
                            <Show when={promoteToShow() == PromoteType.nmscd}>
                                <img class="watermark" src={nmscdWatermark} alt="NMSCDWatermark" />
                            </Show>
                            <Show when={promoteToShow() == PromoteType.assistantNMS}>
                                <img class="watermark" src={assistantNMSWatermark} alt="AssistantNMS" />
                            </Show>
                        </div>
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
                                mt="0.5em"
                                checked={useCustomBackgroundImage()}
                                onChange={() => setUseCustomBackgroundImage((prev) => !prev)}
                            >Use custom background image</Checkbox>

                            <br />
                            <Checkbox
                                mt="0.5em"
                                checked={isPortrait()}
                                onChange={() => setIsPortrait((prev) => !prev)}
                            >Portrait mode</Checkbox>

                            <Show when={useCustomBackgroundImage() == false}>
                                <FormControl mt="0.5em" mb="0.5em">
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
                                <FormControl mt="0.5em" mb="0.5em">
                                    <FormLabel for="customBackgroundImage">Custom Background Image</FormLabel>
                                    <Input
                                        id="customBackgroundImage"
                                        placeholder="Background image"
                                        accept={imageFilter}
                                        type="file"
                                        onChange={onSelectBackgroundImage}
                                    />
                                </FormControl>
                            </Show>

                            <FormControl mt="0.5em" mb="0.5em">
                                <FormLabel for="bg-opacity">Opacity</FormLabel>
                                <Input
                                    id="bg-opacity"
                                    placeholder="Custom image"
                                    onInput={(e: any) => setBackgroundImageOpacity(e?.target?.value ?? 100)}
                                    value={backgroundImageOpacity()}
                                    min='0'
                                    max='100'
                                    type="range"
                                />
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Images</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <FormControl mt="0.5em" mb="0.5em">
                                <FormLabel for="addCustomImage">Add custom image</FormLabel>
                                <Input
                                    id="addCustomImage"
                                    placeholder="Custom image"
                                    onChange={onSelectUserImage}
                                    accept={imageFilter}
                                    type="file"
                                />
                            </FormControl>
                            <FormControl mt="1em" mb="0.5em">
                                <PredefinedImageModal
                                    images={predefinedImages}
                                    imagePath={(imgStr) => predefinedPath + imgStr}
                                    onImageSelect={onSelectPredefinedImage}
                                />
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Text</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <FormControl mt="0.5em" mb="0.5em">
                                <Button variant="outline" onClick={addUserText}>Add custom text</Button>
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Promote</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <FormControl mt="0.5em" mb="0.5em">
                                <RadioGroup defaultValue={promoteToShow()} onChange={(type: any) => setPromoteToShow(type)}>
                                    <VStack spacing="$2" alignItems="left">
                                        <Radio value={PromoteType.none}>None</Radio>
                                        <Radio value={PromoteType.nmscd}>Promote <span class="highlight-secondary">NMSCD</span></Radio>
                                        <Radio value={PromoteType.assistantNMS}>Promote <span class="highlight-secondary">Assistant for No Man's Sky</span></Radio>
                                    </VStack>
                                </RadioGroup>
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <Box textAlign="center" mt="1em">
                    <Button onClick={download}>Download</Button>
                </Box>
            </Box>
        </Flex>
    );
};
