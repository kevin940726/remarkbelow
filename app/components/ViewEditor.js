import React from 'react';
import { Editor as DraftEditor } from 'draft-js';
import styles from './Editor.css';

const ViewEditor = ({ editorState }) => (
  <div className={styles.editor}>
    <DraftEditor
      editorState={editorState}
      readOnly
    />
  </div>
);

export default ViewEditor;
