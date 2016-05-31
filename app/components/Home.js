import React, { Component } from 'react';
import styles from './Home.css';
import Editor from '../containers/Editor';
import View from '../containers/View';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Editor />
        </div>
      </div>
    );
  }
}
