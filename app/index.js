import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import initialState from './store/initialState';
import './app.global.css';

const store = configureStore(initialState);
const history = syncHistoryWithStore(hashHistory, store);

require('electron').ipcRenderer.on('save', function(event, path) {
    var content = store.getState().editor.editorState.getCurrentContent().getPlainText();
    var fs = require('fs');
    if(fs.lstatSync(path).isDirectory()){
      path = path + "/save";
    }
    fs.writeFile(path, content, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }); 
});

require('electron').ipcRenderer.on('open', function(event, path) {
        console.log(path); 
});

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
