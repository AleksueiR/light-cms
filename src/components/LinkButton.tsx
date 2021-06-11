import { Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

const LinkButton = (props: any) => {
    const {
        history,
        location,
        match,
        staticContext,
        to,
        onClick,
        // ⬆ filtering out props that `button` doesn’t know what to do with.
        ...rest
    } = props;
    return (
        <Button
            {...rest} // `children` is just another prop!
            onClick={(event) => {
                onClick && onClick(event);
                history.push(to);
            }}
        />
    );
};

LinkButton.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default withRouter(LinkButton);
