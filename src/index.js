import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


//<React.StricktMode> </React.StricktMode> REACT 18  vs beautiful-dnd Common problem
// when SrtictMode is on. We have ERROW during dragAndDrop:
// Invariant failed: Cannot find droppable entry with id [droppable]
// https://github.com/atlassian/react-beautiful-dnd/issues/2350 
