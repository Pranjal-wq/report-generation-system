import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
    <BrowserRouter v7_startTransition={true} v7_relativeSplatPath={true}>
        <App />
    </BrowserRouter>,
    document.getElementById('root')
);