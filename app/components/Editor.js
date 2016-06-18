import React, { PropTypes } from 'react';
import { Editor as DraftEditor } from 'draft-js';
import styles from './Editor.css';
import syntax from '../utils/syntax.css';
import classNames from 'classnames';

const blockStyleFn = (contentBlock, selection) => (
  classNames(
    syntax.block,
    {
      [syntax.currentLine]: selection.getStartKey() === contentBlock.getKey()
    },
  )
);

const Editor = ({
  refCallBack,
  editorRef,
  editorState,
  onChange,
  onFocus,
  handleReturn,
  onTab,
  onScroll,
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
    onScroll={e => onScroll(e, editorRef)}
  >
    <DraftEditor
      ref={refCallBack}
      editorState={editorState}
      onChange={onChange}
      handleReturn={() => handleReturn(editorState)}
      onTab={() => onTab(editorState)}
      blockStyleFn={contentBlock => blockStyleFn(contentBlock, editorState.getSelection())}
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
