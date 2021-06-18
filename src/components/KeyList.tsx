import { LinkBox, LinkOverlay, List, ListItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Params } from '../types';
import { axs, useURLQuery } from '../util';

export default function KeyList() {
    const { file } = useParams<Params>();
    const folder = useURLQuery().get('folder');

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
                    <ListItem key={key} mt="2">
                        <LinkBox
                            p="1"
                            _hover={{
                                background: 'white',
                                color: 'teal.500'
                            }}
                        >
                            <LinkOverlay display={'flex'} as={RouterLink} to={`/${file}/${key}?folder=${folder}`}>
                                <Text fontSize="md">{key}</Text>
                            </LinkOverlay>
                        </LinkBox>
                    </ListItem>
                );
            })}
        </List>
    );
}
