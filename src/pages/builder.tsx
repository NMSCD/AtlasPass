import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box, Button, Center, Checkbox, classNames, Flex, FormControl, FormLabel, Input, Radio, RadioGroup, Select,
    SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectPlaceholder, SelectTrigger, SelectValue, Text, VStack
} from '@hope-ui/solid';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { Header } from '../components/common/header';
import { PassBackground } from '../components/pass/passBackground';
import { PassGrid } from '../components/pass/passGrid';
import { PassImage } from '../components/pass/passImage';
import { PassText } from '../components/pass/passText';
import { PredefinedImageModal } from '../components/predefinedImageModal';
import { builtInBackgrounds, imageFilter } from '../constants/background';
import { PromoteType } from '../constants/enum/promoteType';
import { assistantAppsWatermark, assistantNMSWatermark, nmscdWatermark, predefinedImages, predefinedPath } from '../constants/images';
import { UserUpload } from '../contracts/userUpload';
import { downloadFile, exportToPng } from '../helper/fileHelper';


export const BuilderPage: Component = () => {
    const [isMobileAnnouncementAccepted, setMobileAnnouncementAccepted] = createSignal(false);

    const [useCustomBackgroundImage, setUseCustomBackgroundImage] = createSignal(false);
    const [isPortrait, setIsPortrait] = createSignal(false);
    const [enableGrid, setEnableGrid] = createSignal(false);
    const [gridSnapPoints, setGridSnapPoints] = createSignal(50);
    const [backgroundImage, setBackgroundImage] = createSignal(builtInBackgrounds[0].imgUrl);
    const [backgroundImageOpacity, setBackgroundImageOpacity] = createSignal(70);

    const [userImages, setUserImages] = createSignal<Array<UserUpload>>([]);
    const [userTexts, setUserTexts] = createSignal<Array<UserUpload>>([]);

    const [promoteToShow, setPromoteToShow] = createSignal(PromoteType.none);

    const [gridRefKey, setGridRefKey] = createSignal('0-0');
    let gridRef: any;

    const timer = setInterval(() => setGridRefKeyFunc(), 1000);
    const setGridRefKeyFunc = () => {
        const {
            offsetWidth = 0,
            offsetHeight = 0,
        } = gridRef;

        setGridRefKey(`${offsetWidth}-${offsetHeight}`);
    }

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
        const dataUrl = await exportToPng(cardElem);
        downloadFile(dataUrl, uuidv4().substring(0, 6) + '.png');
    }

    onCleanup(() => {
        userImages()
            .filter(imgObj => imgObj.data != null)
            .map(imgObj => URL.revokeObjectURL(imgObj.data));
        clearInterval(timer);
    });

    return (
        <Flex minH="calc(100vh - 80px)" class="builder noselect">
            <Box class="builder-preview" overflow="hidden">
                <Center flexDirection="column" onDragOver={(ev: any) => ev?.preventDefault?.()}>
                    <Box ref={gridRef} class={classNames('pass-container', isPortrait() ? 'is-portrait' : '')}>
                        <div class="pass-container-img">
                            <PassBackground
                                backgroundImage={backgroundImage()}
                                backgroundImageOpacity={backgroundImageOpacity() / 100}
                            />
                            <For each={userImages()}>
                                {imgObj => (
                                    <PassImage
                                        src={imgObj.url ?? imgObj.data}
                                        enableGridSnap={enableGrid()}
                                        gridSnapPoints={gridSnapPoints()}
                                        onDelete={deleteUserImage(imgObj.uuid)}
                                    />
                                )}
                            </For>
                            <For each={userTexts()}>
                                {textObj => (
                                    <PassText
                                        enableGridSnap={enableGrid()}
                                        gridSnapPoints={gridSnapPoints()}
                                        onDelete={() => setUserTexts((prev: Array<UserUpload>) => prev.filter(t => t.uuid !== textObj.uuid))}
                                    />
                                )}
                            </For>
                            <Show when={promoteToShow() == PromoteType.nmscd}>
                                <img class="watermark" src={nmscdWatermark} alt="NMSCDWatermark" />
                            </Show>
                            <Show when={promoteToShow() == PromoteType.assistantNMS}>
                                <img class="watermark" src={assistantNMSWatermark} alt="AssistantNMS" />
                            </Show>
                            <Show when={promoteToShow() == PromoteType.assistantApps}>
                                <img class="watermark" src={assistantAppsWatermark} alt="AssistantApps" />
                            </Show>
                        </div>
                        <Show when={enableGrid() === true}>
                            <PassGrid
                                gridRef={gridRef}
                                isPortrait={isPortrait()}
                                gridSnapPoints={gridSnapPoints()}
                            />
                        </Show>
                    </Box>
                </Center>
            </Box>
            <Box class="builder-options" backgroundColor="rgba(0, 0, 0, 0.05)">
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
                            <br />
                            <Checkbox
                                mt="0.5em"
                                checked={enableGrid()}
                                onChange={() => setEnableGrid((prev) => !prev)}
                            >Enable grid snap <i>(experimental)</i></Checkbox>

                            <Show when={enableGrid() == true}>
                                <FormControl mt="0.5em" mb="0.5em">
                                    <FormLabel for="grid-snap-points">Grid snap points</FormLabel>
                                    <Input
                                        id="grid-snap-points"
                                        onInput={(e: any) => setGridSnapPoints(e?.target?.value ?? 50)}
                                        value={gridSnapPoints()}
                                        type="number"
                                    />
                                </FormControl>
                            </Show>

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
                                    min="0"
                                    max="100"
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
                                        <Radio value={PromoteType.assistantApps}>Promote <span class="highlight-secondary">Assistant Apps</span></Radio>
                                    </VStack>
                                </RadioGroup>
                            </FormControl>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                <Box textAlign="center" mt="1em">
                    <Button onClick={download}>Download</Button>
                    <Show when={gridRefKey() !== '0-0'} fallback={<Text mt="1em">Calculating...</Text>}>
                        <Text mt="1em">Export resolution: <b>{gridRefKey().split('-')[0]}px</b> by <b>{gridRefKey().split('-')[1]}px</b></Text>
                    </Show>
                </Box>
            </Box>
            <Show when={isMobileAnnouncementAccepted() == false}>
                <Box class="mobile-announcement">
                    <Header />
                    <Center minH="50vh">
                        <Center flexDirection="column" pl="1em" pr="1em">
                            <Text fontSize="1.5em">Please Note:</Text>
                            <Text textAlign="center" mb="1.5em">This site generates your Atlas card based on what is displayed in the preview window. This means that if your display is small, the preview will be small and so the image export will be small. For best results please use this tool on a larger monitor.</Text>
                            <Checkbox onChange={() => setMobileAnnouncementAccepted(true)}>I accept that my image will be low resolution</Checkbox>
                        </Center>
                    </Center>
                </Box>
            </Show>
        </Flex>
    );
};