import React from 'react';
import { ChakraProvider, Box, Text, Link, VStack, Code, Grid, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

export default class App extends React.Component {
    state = {
        issueList: []
    };

    componentDidMount() {
        this.setState({ issueList: ['issue-00', 'issue-01'] });
    }

    render() {
        return (
            <ChakraProvider theme={theme}>
                <Box textAlign="center" fontSize="xl">
                    <Grid minH="100vh" p={3}>
                        <ColorModeSwitcher justifySelf="flex-end" />
                        <VStack spacing={8}>
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
                        </VStack>
                        <IssueList issues={this.state.issueList}></IssueList>
                    </Grid>
                </Box>
            </ChakraProvider>
        );
    }
}

class IssueList extends React.Component<{ issues: string[] }> {
    render() {
        return (
            <div>
                {this.props.issues.map((issue) => {
                    return <span>{issue}</span>;
                })}
            </div>
        );
    }
}
