import { Textarea } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Params } from '../types';
import { axs, useURLQuery } from '../util';

export default function KeyDetails() {
    const { pathname } = useLocation();
    const folder = useURLQuery().get('folder') || '';
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
