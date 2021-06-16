import {
    Box,
    Text,
    ChakraProvider,
    Grid,
    Link,
    LinkBox,
    LinkOverlay,
    List,
    ListItem,
    Stack,
    Textarea,
    theme,
    Heading
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, matchPath, Route, useLocation, useParams } from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import './style.scss';

const axs = axios.create({
    baseURL: 'http://localhost:9000/'
});

type FileEntry = { name: string; folder: string };
type Params = { file: string; key: string };

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
                <ColorModeSwitcher justifySelf="flex-end" />

                <Heading>PLiNC - PLinc is Not a CMS</Heading>

                <Stack direction="row" spacing={8}>
                    <FileList files={files}></FileList>

                    <Route path="/:file">
                        <KeyList></KeyList>
                    </Route>

                    <KeyDetails></KeyDetails>
                </Stack>

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

function FileList({ files }: { files: FileEntry[] }) {
    return (
        <div>
            <List>
                {files.map(({ name, folder }) => {
                    return (
                        <ListItem key={`${folder}-${name}`} mt="2">
                            <LinkBox
                                border={'1px'}
                                p="6"
                                _hover={{
                                    background: 'white',
                                    color: 'teal.500'
                                }}
                            >
                                <Text fontSize="sm" color={'grey'}>
                                    {folder}
                                </Text>

                                <LinkOverlay display={'flex'} as={RouterLink} to={`/${name}?folder=${folder}`}>
                                    <Text>{name}</Text>
                                </LinkOverlay>
                            </LinkBox>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}

function KeyList() {
    const { file } = useParams<Params>();
    const folder = useQuery().get('folder');

    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        async function fetch() {
            const response = await axs.get<string[]>(`/api/files/${file}`, { params: { folder: folder } });
            setKeys(response.data);
        }
        fetch();
    }, [file, folder]);

    return (
        <List>
            {keys.map((key) => {
                return (
                    <ListItem key={key}>
                        <Link
                            h={'20'}
                            display={'flex'}
                            as={RouterLink}
                            to={`/${file}/${key}?folder=${folder}`}
                            colorScheme="orange"
                        >
                            {key}
                        </Link>
                    </ListItem>
                );
            })}
        </List>
    );
}

function KeyDetails() {
    const { pathname } = useLocation();
    const folder = useQuery().get('folder') || '';
    const {
        params: { file, key }
    } = matchPath<Params>(pathname, { path: '/:file/:key' }) || { params: { file: null, key: null } };

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        fetch();

        if (!textareaRef.current) {
            return;
        }

        const textArea = textareaRef.current;

        return () => {
            if (!file || !key) {
                return;
            }

            axs.put(`/api/files/${file}/${key}`, { payload: textArea.value, folder });

            textArea.value = '';
        };

        async function fetch() {
            if (!file || !key) {
                return;
            }

            const response = await axs.get<string>(`/api/files/${file}/${key}`, { params: { folder } });

            textArea.value = response.data;
        }
    }, [file, key, folder]);

    return (
        <div>
            <Textarea w={500} h={300} ref={textareaRef} resize={'both'}></Textarea>
        </div>
    );
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
