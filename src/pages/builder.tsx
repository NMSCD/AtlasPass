import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Center, Checkbox, classNames, Flex, FormControl, FormLabel, Image, Input, Radio, RadioGroup, Spinner, Text, VStack
} from '@hope-ui/solid';
import { Component, createSignal, For, onCleanup, Show } from 'solid-js';
import { v4 as uuidv4 } from 'uuid';
import { LayerList } from '../components/builder/layerList';
import { Header } from '../components/common/header';
import { LoadTemplateModal } from '../components/loadTemplateModal';
import { PassBackground } from '../components/pass/passBackground';
import { PassGrid } from '../components/pass/passGrid';
import { IPassImageTemplateProps, PassImage } from '../components/pass/passImage';
import { IPassTextTemplateProps, PassText } from '../components/pass/passText';
import { PredefinedImageModal } from '../components/predefinedImageModal';
import { backgroundNmsCover, backgroundsFolder, builtInBackgrounds, imageFilter } from '../constants/background';
import { NetworkState } from '../constants/enum/networkState';
import { PromoteType } from '../constants/enum/promoteType';
import { assistantAppsWatermark, assistantNMSWatermark, nmscdWatermark, predefinedImages, predefinedPath } from '../constants/images';
import { customTemplate, IBuilderFunctions, TemplateBuilder } from '../constants/templates';
import { ExportTemplate } from '../contracts/exportTemplate';
import { UserUpload, UserUploadTypes } from '../contracts/userUpload';
import { getAllElementsTemplateData, getElementTemplateData } from '../helper/documentHelper';
import { downloadFile, downloadJsonAsFile, exportToPng } from '../helper/fileHelper';
import { gridRefHeight, gridRefWidth } from '../helper/gridRefHelper';
import { stringInputPopup } from '../helper/popupHelper';

export const BuilderPage: Component = () => {
    const [isMobileAnnouncementAccepted, setMobileAnnouncementAccepted] = createSignal(false);
    const [isTemplateState, setTemplateState] = createSignal(NetworkState.Success);
    const [indexChangeRefreshCounter, setIndexChangeRefreshCounter] = createSignal(0);

    const [useCustomBackgroundImage, setUseCustomBackgroundImage] = createSignal(false);
    const [isPortrait, setIsPortrait] = createSignal(false);
    const [enableGrid, setEnableGrid] = createSignal(false);
    const [gridSnapPoints, setGridSnapPoints] = createSignal(50);
    const [backgroundImage, setBackgroundImage] = createSignal(backgroundNmsCover);
    const [backgroundImageOpacity, setBackgroundImageOpacity] = createSignal(70);

    const [userImages, setUserImages] = createSignal<Array<UserUpload<IPassImageTemplateProps>>>([]);
    const [userTexts, setUserTexts] = createSignal<Array<UserUpload<IPassTextTemplateProps>>>([]);

    const [promoteToShow, setPromoteToShow] = createSignal(PromoteType.none);

    const [selectedElement, setSelectedElement] = createSignal<string | undefined>(undefined);

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

        const objUrls: Array<UserUpload<IPassImageTemplateProps>> = [];
        for (const file of event.target.files) {
            objUrls.push({
                uuid: uuidv4(),
                type: UserUploadTypes.img,
                data: URL.createObjectURL(file),
                templateData: {
                    zIndex: [...userImages(), ...userTexts()].length + 1,
                }
            });
        }
        setUserImages((prev) => [...prev, ...objUrls]);
        setTimeout(() => setIndexChangeRefreshCounter(prev => prev + 1), 250);
        event.target.value = null;
    }

    const onSelectPredefinedImage = (imgStr: string) => {
        const imgObj: UserUpload<IPassImageTemplateProps> = {
            uuid: uuidv4(),
            type: UserUploadTypes.img,
            url: imgStr,
            templateData: {
                zIndex: [...userImages(), ...userTexts()].length + 1,
            }
        };
        setUserImages((prev) => [...prev, imgObj]);
        setTimeout(() => setIndexChangeRefreshCounter(prev => prev + 1), 250);
    }

    const deleteUserImage = (uuid: string) => () => {
        setUserImages((prev: Array<UserUpload<IPassImageTemplateProps>>) => {
            const newUserImagesArray: Array<UserUpload<IPassImageTemplateProps>> = [];
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
        const newTextObj: UserUpload<IPassTextTemplateProps> = {
            uuid: uuidv4(),
            type: UserUploadTypes.txt,
            templateData: {
                zIndex: [...userImages(), ...userTexts()].length + 1,
            }
        };
        setUserTexts((prev) => [...prev, newTextObj]);
        setTimeout(() => setIndexChangeRefreshCounter(prev => prev + 1), 250);
    }

    const downloadPng = async () => {
        const cardElem = document.querySelector(".pass-container-img")!;
        const dataUrl = await exportToPng(cardElem);
        downloadFile(dataUrl, uuidv4().substring(0, 6) + '.png');
    }

    const setTemplate = async (template: TemplateBuilder) => {
        const funcs: IBuilderFunctions = {
            setTemplateState,
            setUseCustomBackgroundImage,
            setIsPortrait,
            setEnableGrid,
            setGridSnapPoints,
            setBackgroundImage,
            setBackgroundImageOpacity,
            setUserImages,
            setUserTexts,
            setPromoteToShow,
        };

        setTemplateState(NetworkState.Loading);
        try {
            setUserImages([]);
            setUserTexts([]);
            const additionalData = await template.initial(funcs, gridRefKey());
            await template.build(funcs, gridRefKey(), additionalData);
        } catch (ex) {
            console.error(ex);
        }
        setTemplateState(NetworkState.Success);
    }

    const duplicateItem = (uuid: string, type: string) => () => {

        function editIfNeeded<T>(prevItem: UserUpload<T>, localUuid: string): Array<UserUpload<T>> {
            if (prevItem.uuid !== localUuid) return [prevItem];

            let fetchedTemplateData: any = { ...prevItem.templateData };
            try {
                const jsonData = getElementTemplateData(localUuid);
                fetchedTemplateData = jsonData.templateData;
            } catch (ex) {
                console.error(ex);
            }
            const editedItem = {
                ...prevItem,
                uuid: uuidv4().toString(),
                templateData: {
                    ...fetchedTemplateData,
                    initX: fetchedTemplateData.initX + 5,
                    initY: fetchedTemplateData.initY + 5,
                }
            }
            return [prevItem, editedItem];
        };

        if (type === UserUploadTypes.img) {
            setUserImages(prev => prev.flatMap(img => editIfNeeded(img, uuid)));
        }
        if (type === UserUploadTypes.txt) {
            setUserTexts(prev => prev.flatMap(txt => editIfNeeded(txt, uuid)));
        }
    }

    const deleteItem = (uuid: string, type: string) => () => {
        if (type === UserUploadTypes.img) {
            deleteUserImage(uuid);
        }
        if (type === UserUploadTypes.txt) {
            setUserTexts(prev => prev.filter(t => t.uuid !== uuid));
        }
        setTimeout(() => setIndexChangeRefreshCounter(prev => prev + 1), 250);
    }

    const editElementName = (uuid: string, type: string, currentName: string) => async () => {

        const newName = await stringInputPopup({
            title: 'Enter a new name',
            input: 'text',
            inputValue: currentName,
            focusOnInput: true,
        });
        if (newName == null || newName.length < 1) return;

        const editIfNeeded = (prevItem: UserUpload<any>, uuid: string, localNewName: string) => {
            if (prevItem.uuid != uuid) return prevItem;

            let fetchedTemplateData = { ...prevItem.templateData };
            try {
                const jsonData = getElementTemplateData(uuid);
                fetchedTemplateData = jsonData.templateData;
            } catch (ex) {
                console.error(ex);
            }
            return { ...prevItem, name: localNewName, templateData: fetchedTemplateData };
        };

        if (type === UserUploadTypes.img) {
            setUserImages((prev) => prev.map(i => editIfNeeded(i, uuid, newName)));
        }
        if (type === UserUploadTypes.txt) {
            setUserTexts((prev) => prev.map(i => editIfNeeded(i, uuid, newName)));
        }
    }

    const exportAsTemplate = async () => {
        const allJsonItems = getAllElementsTemplateData();

        const allData: ExportTemplate = {
            useCustomBackgroundImage: useCustomBackgroundImage(),
            isPortrait: isPortrait(),
            enableGrid: enableGrid(),
            gridSnapPoints: gridSnapPoints(),
            backgroundImage: backgroundImage(),
            backgroundImageOpacity: backgroundImageOpacity(),
            promoteToShow: promoteToShow(),
            width: gridRefWidth(gridRefKey()),
            height: gridRefHeight(gridRefKey()),
            userImages: userImages()
                .map(usrI => allJsonItems.find(jsn => jsn.uuid === usrI.uuid)!)
                .filter(usrI => usrI != null),
            userTexts: userTexts()
                .map(usrT => allJsonItems.find(jsn => jsn.uuid === usrT.uuid)!)
                .filter(usrT => usrT != null),
        }

        downloadJsonAsFile(allData, uuidv4().substring(0, 6) + '.json');
    }

    onCleanup(() => {
        userImages()
            .filter(imgObj => imgObj.data != null)
            .map(imgObj => URL.revokeObjectURL(imgObj.data));
        clearInterval(timer);
    });

    return (
        <Flex class="builder noselect">
            <Box class="builder-preview" overflow="hidden">
                <Center flexDirection="column" height="100%" onDragOver={(ev: any) => ev?.preventDefault?.()}>
                    <Box ref={gridRef} class={classNames('pass-container', isPortrait() ? 'is-portrait' : '')}>
                        <div class="pass-container-img">
                            <PassBackground
                                backgroundImage={backgroundImage()}
                                backgroundImageOpacity={backgroundImageOpacity() / 100}
                            />
                            <For each={userImages()}>
                                {imgObj => (
                                    <PassImage
                                        uuid={imgObj.uuid}
                                        name={imgObj.name}
                                        gridWidth={gridRefWidth(gridRefKey())}
                                        gridHeight={gridRefHeight(gridRefKey())}
                                        isSelected={imgObj.uuid === selectedElement()}
                                        src={imgObj.url ?? imgObj.data}
                                        templateData={imgObj.templateData}
                                        enableGridSnap={enableGrid()}
                                        gridSnapPoints={gridSnapPoints()}
                                        onDelete={deleteUserImage(imgObj.uuid)}
                                        onZIndexChange={() => setIndexChangeRefreshCounter(prev => prev + 1)}
                                    />
                                )}
                            </For>
                            <For each={userTexts()}>
                                {textObj => (
                                    <PassText
                                        uuid={textObj.uuid}
                                        name={textObj.name}
                                        gridWidth={gridRefWidth(gridRefKey())}
                                        gridHeight={gridRefHeight(gridRefKey())}
                                        isSelected={textObj.uuid === selectedElement()}
                                        templateData={textObj.templateData}
                                        enableGridSnap={enableGrid()}
                                        gridSnapPoints={gridSnapPoints()}
                                        onDelete={() => setUserTexts((prev: Array<UserUpload<IPassTextTemplateProps>>) => prev.filter(t => t.uuid !== textObj.uuid))}
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
                        <Show when={isTemplateState() === NetworkState.Loading}>
                            <Center class="center-loader">
                                <Spinner size="xl" />
                            </Center>
                        </Show>
                    </Box>
                </Center>
            </Box>
            <Box class="builder-options" backgroundColor="rgba(0, 0, 0, 0.05)">
                <Accordion allowMultiple>
                    <AccordionItem>
                        <AccordionButton>
                            <Text flex="1" textAlign="start">Templates</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                            <Show when={gridRefKey() != '0-0'}>
                                <FormControl mt="0.5em" mb="0.5em">
                                    <LoadTemplateModal setTemplate={setTemplate} />
                                </FormControl>
                                <FormControl mt="0.5em" mb="0.5em">
                                    <Button colorScheme="warning" variant="outline" onClick={() => setTemplate(customTemplate)}>Template from JSON (experimental)</Button>
                                </FormControl>
                            </Show>
                        </AccordionPanel>
                    </AccordionItem>

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
                                    <FormLabel for="grid-snap-points">Grid snap points (px)</FormLabel>
                                    <Input
                                        id="grid-snap-points"
                                        onInput={(e: any) => setGridSnapPoints(e?.target?.value ?? 50)}
                                        value={gridSnapPoints()}
                                        type="number"
                                    />
                                </FormControl>
                            </Show>

                            <Show when={useCustomBackgroundImage() == false}>
                                <FormControl mt="1em" mb="0.5em">
                                    <PredefinedImageModal
                                        gridColumns={4}
                                        gap="$0"
                                        images={builtInBackgrounds}
                                        buttonText="Background selection"
                                        onImageSelect={(imgStr) => setBackgroundImage(backgroundsFolder + imgStr)}
                                        imageRenderer={(imgStr) => (
                                            <Box class="predefined-bg-img">
                                                <Image
                                                    src={backgroundsFolder + imgStr} alt={imgStr}
                                                />
                                            </Box>
                                        )}
                                    />
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
                                    step="1"
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
                                    gap="$10"
                                    minChildWidth="4em"
                                    images={predefinedImages}
                                    buttonText="Add from selection"
                                    onImageSelect={(imgStr) => onSelectPredefinedImage(predefinedPath + imgStr)}
                                    imageRenderer={(imgStr) => (
                                        <Image
                                            src={predefinedPath + imgStr} alt={imgStr}
                                            class="hover-enlarge"
                                        />
                                    )}
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
                                <RadioGroup value={promoteToShow()} onChange={(type: any) => setPromoteToShow(type)}>
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

                    <Show when={[...userImages(), ...userTexts()].length > 0}>
                        <AccordionItem>
                            <AccordionButton>
                                <Text flex="1" textAlign="start"><b>Advanced:</b> Elements</Text>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <LayerList
                                    indexChangeRefreshCounter={indexChangeRefreshCounter()}
                                    userUploads={[...userImages(), ...userTexts()]}
                                    selectedElement={selectedElement()}
                                    selectItem={(uuid) => setSelectedElement(uuid)}
                                    editElementName={editElementName}
                                    duplicateItem={duplicateItem}
                                    deleteItem={deleteItem}
                                />
                                <Box textAlign="center" mt="1em" mb="0.5em">
                                    <Button colorScheme="warning" width="$full" onClick={exportAsTemplate}>Export as template (experimental)</Button>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    </Show>

                </Accordion>
                <Box textAlign="center" m="1em">
                    <Button width="$full" mt="0.5em" onClick={downloadPng}>Download</Button>
                    <Show when={gridRefKey() !== '0-0'} fallback={<Text mt="1em">Calculating...</Text>}>
                        <Text mt="1em">Export resolution: <b>{gridRefWidth(gridRefKey())}px</b> by <b>{gridRefHeight(gridRefKey())}px</b></Text>
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
        </Flex >
    );
};