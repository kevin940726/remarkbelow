import React, { PropTypes } from 'react';
import { Editor as DraftEditor } from 'draft-js';
import styles from './Editor.css';

const Editor = ({
  refCallBack,
  editorRef,
  editorState,
  onChange,
  onFocus,
  handleReturn,
  onTab
}) => (
  <div
    className={styles.editor}
    onClick={() => onFocus(editorRef)}
    onKeyDown={e => {
      if (e.keyCode === 9) {
        e.preventDefault();
        e.stopPropagation();
      }
    }}
  >
    <DraftEditor
      ref={refCallBack}
      editorState={editorState}
      onChange={onChange}
      handleReturn={() => handleReturn(editorState)}
      onTab={() => onTab(editorState)}
      blockStyleFn={() => 'block-line'}
      spellCheck
    />
  </div>
);

Editor.propTypes = {
  refCallBack: PropTypes.func,
  editorState: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
};

export default Editor;
