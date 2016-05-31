import React, { PropTypes } from 'react';
import { Editor as DraftEditor } from 'draft-js';
import styles from './Editor.css';

const Editor = ({ refCallBack, editorRef, editorState, onChange, onFocus }) => (
  <div
    className={styles.editor}
    onClick={() => onFocus(editorRef)}
  >
    <DraftEditor ref={refCallBack} editorState={editorState} onChange={onChange} />
  </div>
);

Editor.propTypes = {
  refCallBack: PropTypes.func,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
};

export default Editor;
