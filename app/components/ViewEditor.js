import React from 'react';
import { Editor as DraftEditor } from 'draft-js';
import { editor, viewEditor } from './Editor.css';
import styles from 'github-markdown-css';
import classNames from 'classnames';

const ViewEditor = ({ editorState }) => (
  <div className={classNames(editor, viewEditor, styles['markdown-body'])}>
    <DraftEditor
      editorState={editorState}
      readOnly
    />
  </div>
);

export default ViewEditor;
