import { Box, Link, Button, ChakraProvider, Grid, List, ListItem, Stack, theme } from '@chakra-ui/react';
import queryString from 'query-string';
import React, { FunctionComponent, useState, useMemo, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    useHistory,
    Link as RouterLink,
    useLocation,
    useParams,
    matchPath,
    useRouteMatch
} from 'react-router-dom';
import axios from 'axios';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

const axs = axios.create({
    baseURL: 'http://localhost:9000/'
});

export default class App extends React.Component {
    state = {
        issueList: []
    };

    async componentDidMount() {
        const response = await axs.get<string[]>('/api/issues');

        this.setState({ issueList: response.data });
    }

    render() {
        return (
            <ChakraProvider theme={theme}>
                <Box fontSize="xl">
                    <Grid minH="100vh" p={3}>
                        <ColorModeSwitcher justifySelf="flex-end" />

                        <Stack direction="row" spacing={8}>
                            <IssueList issues={this.state.issueList}></IssueList>
                            <Route path="/:issue">
                                <KeyList></KeyList>
                            </Route>

                            {/* <Route path="/:issue/:key"> */}
                            <KeyDetails></KeyDetails>
                            {/* </Route> */}
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

const IssueList: FunctionComponent<{ issues: string[] }> = ({ issues }) => {
    /* const router = useRouter();

    const match = useRouteMatch<params>('/:issue'); */

    return (
        <div>
            <List>
                {issues.map((issue) => {
                    return (
                        <ListItem key={issue}>
                            <Link h={'20'} display={'flex'} as={RouterLink} to={`/${issue}`}>
                                {issue}
                            </Link>

                            {/* <Button onClick={() => router.push(`/${issue}`)} colorScheme="blue">
                                {issue}
                            </Button> */}
                            {/* <LinkButton to={`/${issue}`} colorScheme="blue">
                                {issue}
                            </LinkButton> */}
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
};

type params = { issue: string; key: string };

function KeyList() {
    const { issue } = useParams<params>();
    const [keys, setKeys] = useState<string[]>([]);

    useEffect(() => {
        async function fetch() {
            const response = await axs.get<string[]>(`/api/issues/${issue}`);
            setKeys(response.data);
        }
        fetch();
    }, [issue]);

    const router = useRouter();

    return (
        <List>
            {keys.map((key) => {
                return (
                    <ListItem key={key}>
                        <Button onClick={() => router.push(`/${issue}/${key}`)} colorScheme="orange">
                            {key}
                        </Button>
                    </ListItem>
                );
            })}
        </List>
    );
}

function KeyDetails() {
    const { pathname } = useLocation();
    const {
        params: { issue, key }
    } = matchPath<params>(pathname, { path: '/:issue/:key' }) || { params: { issue: null, key: null } };

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

            if (!issue || !key) {
                return;
            }

            axs.put(`/api/issues/${issue}/${key}`, { payload: mdeRef.current?.value() });

            mdeRef.current.value(``);
        };

        async function fetch() {
            if (!issue || !key) {
                return;
            }

            const response = await axs.get<string>(`/api/issues/${issue}/${key}`);

            if (!mdeRef.current) {
                return;
            }

            mdeRef.current.value(response.data);
        }
    }, [issue, key]);

    return (
        <div>
            <textarea ref={textareaRef}></textarea>
        </div>
    );
}

export function useRouter() {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();
    // Return our custom router object
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
        return {
            // For convenience add push(), replace(), pathname at top level
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            // Merge params and parsed query string into single "query" object
            // so that they can be used interchangeably.
            // Example: /:topic?sort=popular -> { topic: "react", sort: "popular" }
            query: {
                ...queryString.parse(location.search), // Convert string to object
                ...params
            },
            // Include match, location, history objects so we have
            // access to extra React Router functionality if needed.
            match,
            location,
            history
        };
    }, [params, match, location, history]);
}
