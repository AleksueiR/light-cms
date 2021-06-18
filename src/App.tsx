import { Box, ChakraProvider, Flex, Heading, Text, Stack, Image, theme } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import FileList from './components/FileList';
import KeyDetails from './components/KeyDetails';
import KeyList from './components/KeyList';
import './style.scss';
import { FileEntry } from './types';
import { axs } from './util';

export default function App() {
    const [files, setFiles] = useState<FileEntry[]>([]);

    useEffect(() => {
        async function fetch() {
            const response = await axs.get<FileEntry[]>('/api/files');

            setFiles(response.data);
        }
        fetch();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <Box fontSize="xl" p={3}>
                {/* <Grid minH="100vh" p={3}> */}
                {/* <ColorModeSwitcher justifySelf="flex-end" /> */}

                <Flex>
                    <Flex flexDirection="column" w="64" flexShrink={0}>
                        <Flex as="header" alignItems="center" h="24" mx="3">
                            <Image boxSize="24" src="./laptop.png"></Image>

                            <Stack spacing="-10px" ml="2" mb="2">
                                <Heading fontSize="5xl">
                                    <Text as="span" fontWeight="bold">
                                        PL
                                    </Text>
                                    <Text as="span" fontWeight="light">
                                        inc
                                    </Text>
                                </Heading>
                                <Text fontSize="xl" as="span" fontWeight="light">
                                    is not a CMS
                                </Text>
                            </Stack>
                        </Flex>

                        <Box h="1px" borderTopWidth="1px" borderTopColor="gray.300" mx="3" my="3"></Box>

                        <FileList files={files}></FileList>
                    </Flex>

                    <Flex flexDirection="column" w="xs" backgroundColor="gray.50">
                        <Box height="24"></Box>

                        <Box h="1px" borderTopWidth="1px" borderTopColor="gray.300" mx="3" my="3"></Box>

                        <Route path="/:file">
                            <KeyList></KeyList>
                        </Route>
                    </Flex>

                    <Flex flexDirection="column">
                        <Box height="24"></Box>

                        <Box h="1px" borderTopWidth="1px" borderTopColor="gray.300" mx="3" my="3"></Box>

                        <KeyDetails></KeyDetails>
                    </Flex>
                </Flex>

                {/* <VStack spacing={8}>
                        <Logo h="20vmin" pointerEvents="none" />
                        <Text>
                            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
                        </Text>
                        <Link
                            color="teal.500"
                            href="https://chakra-ui.com"
                            fontSize="2xl"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn Chakra
                        </Link>
                    </VStack> */}
                {/* </Grid> */}
            </Box>
        </ChakraProvider>
    );
}
