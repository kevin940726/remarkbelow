import React, { Component } from 'react';
import styles from './Home.css';
import SplitPane from 'react-split-pane';
import Editor from '../containers/Editor';
import ViewEditor from '../containers/ViewEditor';

export default class Home extends Component {
  render() {
    return (
      <div>
        <SplitPane className={styles.container} split="vertical" minSize={100} defaultSize="50%">
          <Editor />
          <ViewEditor />
        </SplitPane>
      </div>
    );
  }
}
