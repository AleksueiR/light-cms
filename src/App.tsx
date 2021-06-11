import { Box, Link, Button, ChakraProvider, Grid, List, ListItem, Stack, theme } from '@chakra-ui/react';
import queryString from 'query-string';
import React, { FunctionComponent, useMemo, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    useHistory,
    Link as RouterLink,
    useLocation,
    useParams,
    useRouteMatch
} from 'react-router-dom';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import SimpleMDE from 'simplemde';
import 'simplemde/dist/simplemde.min.css';

export default class App extends React.Component {
    state = {
        issueList: []
    };

    componentDidMount() {
        this.setState({ issueList: ['issue-00', 'issue-01', 'issue-02'] });
    }

    render() {
        return (
            <ChakraProvider theme={theme}>
                <Router>
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
                </Router>
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

    const keys = ['key-01', 'key-02', 'key-03'];

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
    const { issue, key } = useParams<params>();

    useEffect(() => {
        const simplemde = new SimpleMDE({ element: document.getElementById(`blah`) as HTMLElement });
        console.log('effe');
    }, []);

    return (
        <div>
            {issue} {key}
            <textarea id="blah"></textarea>
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
