import { LinkBox, LinkOverlay, List, ListItem, Text } from '@chakra-ui/react';
import React from 'react';
import { FileEntry } from '../types';
import { Link as RouterLink } from 'react-router-dom';

export default function FileList({ files }: { files: FileEntry[] }) {
    return (
        <div>
            <List>
                {files.map(({ name, folder }) => {
                    return (
                        <ListItem key={`${folder}-${name}`}>
                            <LinkBox
                                p="2"
                                _hover={{
                                    background: '#76D5FA14'
                                }}
                            >
                                <Text as="span" fontSize="sm" color={'grey'}>
                                    {folder}
                                </Text>

                                <LinkOverlay display={'flex'} as={RouterLink} to={`/${name}?folder=${folder}`}>
                                    <Text as="span" fontWeight="semibold" fontSize="md">
                                        {name}
                                    </Text>
                                </LinkOverlay>
                            </LinkBox>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
