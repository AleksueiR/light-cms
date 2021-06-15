import { Box, ChakraProvider, Grid, Link, List, ListItem, Stack, theme } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, matchPath, Route, useLocation, useParams } from 'react-router-dom';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import { ColorModeSwitcher } from './ColorModeSwitcher';

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
            <Box fontSize="xl">
                <Grid minH="100vh" p={3}>
                    <ColorModeSwitcher justifySelf="flex-end" />

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
                </Grid>
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
                        <ListItem key={`${folder}-${name}`}>
                            <Link h={'20'} display={'flex'} as={RouterLink} to={`/${name}?folder=${folder}`}>
                                <span>{name}</span>
                                <span>{folder}</span>
                            </Link>
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
    const mdeRef = React.useRef<SimpleMDE | null>(null);

    useEffect(() => {
        mdeRef.current = new SimpleMDE({ element: textareaRef.current || undefined });
    }, []);

    useEffect(() => {
        fetch();

        return () => {
            if (!mdeRef.current) {
                return;
            }
            console.log(mdeRef.current?.value());

            if (!file || !key) {
                return;
            }

            axs.put(`/api/files/${file}/${key}`, { payload: mdeRef.current?.value(), folder });

            mdeRef.current.value(``);
        };

        async function fetch() {
            if (!file || !key) {
                return;
            }

            const response = await axs.get<string>(`/api/files/${file}/${key}`, { params: { folder } });

            if (!mdeRef.current) {
                return;
            }

            mdeRef.current.value(response.data);
        }
    }, [file, key, folder]);

    return (
        <div>
            <textarea ref={textareaRef}></textarea>
        </div>
    );
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
