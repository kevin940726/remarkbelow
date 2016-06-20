import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import initialState from './store/initialState';
import './app.global.css';
import { ipcRenderer } from 'electron';
import { openFromText } from './actions/editor';

const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);

ipcRenderer.on('save', (event, path) => {
  const content = store.getState().editor.editorState.getCurrentContent().getPlainText();
  ipcRenderer.send('save-content', path, content);
});

ipcRenderer.on('open-content', (event, content) => {
  store.dispatch(openFromText(content));
});

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
