import { Box, Center, createDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Heading, Image } from '@hope-ui/solid';
import type { Component } from 'solid-js';

import { HamburgerIcon } from '../icon/hamburgerIcon';
import { BasicLink } from '../core/link';
import { site } from '../../constants/site';
import packageJson from '../../../package.json';

export const Header: Component = () => {
    const { isOpen, onOpen, onClose } = createDisclosure();

    return (
        <Box
            pb="5px"
            class="header"
            backgroundColor="rgba(255,255,255,0.1)"
            zIndex={100}
        >
            <Flex>
                <Center pl="1em" className="noselect">
                    <Image boxSize="75px" padding="0.5em" src="/assets/img/logo.png" />
                </Center>
                <Box pl="1em" flex="1" className="noselect">
                    <Center height="100%">
                        <Heading level={1} size="3xl">Atlas Pass creator</Heading>
                    </Center>
                </Box>
                <Center mr="2em">
                    <HamburgerIcon fontSize="2.5em" class="pointer" onClick={onOpen} />
                </Center>
            </Flex>

            <Drawer
                opened={isOpen()}
                placement="right"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent class="noselect">
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <br />
                        <p>🞄&nbsp;<BasicLink href={site.nmscd.website} title={site.nmscd.nickName}>{`${site.nmscd.nickName} homepage`}</BasicLink></p>
                        <p>🞄&nbsp;<BasicLink href={site.nmscd.projectsPage} title={`${site.nmscd.nickName} projects`}>{`Other ${site.nmscd.nickName} projects`}</BasicLink></p>
                        <br />
                        <p>🞄&nbsp;<BasicLink href={site.nmscd.github} title={`${site.nmscd.nickName} Github Org`}>{`${site.nmscd.nickName} Github Organisation`}</BasicLink></p>
                        <p>🞄&nbsp;<BasicLink href={site.gitRepo} title="Source code">Source code</BasicLink></p>
                        <br />
                    </DrawerBody>
                    <DrawerFooter>
                        <p style="text-align: right">
                            <span>v{packageJson.version}</span><br />
                            Built by <BasicLink href={site.assistantNMS.website} title={site.assistantNMS.nickName}>{site.assistantNMS.nickName}</BasicLink>
                        </p>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}
