import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

function render(Component: typeof App) {
    ReactDOM.render(
        <React.StrictMode>
            <ColorModeScript />
            <Router>
                <Component />
            </Router>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

render(App);

if (module.hot) {
    module.hot.accept('./App', () => {
        render(require('./App').default);
    });
}
