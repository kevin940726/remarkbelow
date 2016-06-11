import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { saveEditorRef, editorOnChange, viewEditorOnChange } from '../actions/editor';
import { RichUtils, EditorState } from 'draft-js';
import { block } from '../utils/regex';

const mapStateToProps = state => ({
  editorRef: state.editor.editorRef,
  editorState: state.editor.editorState,
});

const mapDispatchToProps = dispatch => ({
  refCallBack: ref => dispatch(saveEditorRef(ref)),
  onChange: editorState => {
    dispatch(editorOnChange(editorState));
    setTimeout(() => {
      dispatch(viewEditorOnChange(EditorState.createWithContent(editorState.getCurrentContent())));
    });
  },
  onFocus: ref => ref.focus(),
  handleReturn: editorState => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const contentBlock = currentContent.getBlockForKey(selection.getAnchorKey());

    if (block.codeBlockStart.exec(contentBlock.getText())) {
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      dispatch(editorOnChange(newEditorState));
      return true;
    }

    return false;
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
