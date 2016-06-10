import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { saveEditorRef, editorOnChange } from '../actions/editor';
import { Modifier, EditorState, RichUtils } from 'draft-js';
import { block } from '../utils/regex';

const mapStateToProps = state => ({
  editorRef: state.editor.editorRef,
  editorState: state.editor.editorState,
});

const mapDispatchToProps = dispatch => ({
  refCallBack: ref => dispatch(saveEditorRef(ref)),
  onChange: editorState => {
    // const currentContent = editorState.getCurrentContent();
    // const selection = editorState.getSelection();
    // const contentBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    // let newEditorState = editorState;
    // const text = contentBlock.getText();
    //
    // if (/\n\n$/.exec(text)) {
    //   const newContent = Modifier.splitBlock(newEditorState, selection);
    //   newEditorState = EditorState.push(newEditorState, newContent, 'split-block');
    // }
    // if (block.blockquote.exec(text)) {
    //   newEditorState = RichUtils.insertSoftNewline(newEditorState);
    // }
    //
    dispatch(editorOnChange(editorState));
  },
  onFocus: ref => ref.focus(),
  handleReturn: editorState => {
    // const currentContent = editorState.getCurrentContent();
    // const selection = editorState.getSelection();
    // const contentBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    //
    // if (!/\n$/.exec(contentBlock.getText())) {
    //   const newEditorState = RichUtils.insertSoftNewline(editorState);
    //   dispatch(editorOnChange(newEditorState));
    //   return true;
    // }
    //
    // const newEditorState = RichUtils.onDelete(editorState);
    // dispatch(editorOnChange(newEditorState));
    // return false;
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
