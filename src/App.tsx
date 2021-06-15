import { Box, ChakraProvider, Grid, Link, List, ListItem, Stack, theme } from '@chakra-ui/react';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link as RouterLink, matchPath, Route, useLocation, useParams } from 'react-router-dom';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const axs = axios.create({
    baseURL: 'http://localhost:9000/'
});

type FileEntry = { name: string; folder: string };

export default class App extends React.Component {
    state = {
        files: []
    };

    async componentDidMount() {
        const response = await axs.get<FileEntry[]>('/api/files');

        this.setState({ files: response.data });
    }

    render() {
        return (
            <ChakraProvider theme={theme}>
                <Box fontSize="xl">
                    <Grid minH="100vh" p={3}>
                        <ColorModeSwitcher justifySelf="flex-end" />

                        <Stack direction="row" spacing={8}>
                            <FileList files={this.state.files}></FileList>

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
}

const FileList: FunctionComponent<{ files: FileEntry[] }> = ({ files }) => {
    return (
        <div>
            <List>
                {files.map(({ name, folder }) => {
                    return (
                        <ListItem key={`${name}-${folder}`}>
                            <Link h={'20'} display={'flex'} as={RouterLink} to={`/${folder}${name}`}>
                                {name}-{folder}
                            </Link>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

type params = { folder: string; file: string; key: string };

function KeyList() {
    const { file } = useParams<params>();
    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        async function fetch() {
            const response = await axs.get<string[]>(`/api/files/${file}`);
            setKeys(response.data);
        }
        fetch();
    }, [file]);

    return (
        <List>
            {keys.map((key) => {
                return (
                    <ListItem key={key}>
                        <Link h={'20'} display={'flex'} as={RouterLink} to={`/${file}/${key}`} colorScheme="orange">
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
    const {
        params: { file, key }
    } = matchPath<params>(pathname, { path: '/:file/:key' }) || { params: { file: null, file: null } };

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

            axs.put(`/api/issues/${file}/${key}`, { payload: mdeRef.current?.value() });

            mdeRef.current.value(``);
        };

        async function fetch() {
            if (!file || !key) {
                return;
            }

            const response = await axs.get<string>(`/api/issues/${file}/${key}`);

            if (!mdeRef.current) {
                return;
            }

            mdeRef.current.value(response.data);
        }
    }, [file, key]);

    return (
        <div>
            <textarea ref={textareaRef}></textarea>
        </div>
    );
}
