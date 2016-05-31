import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { saveEditorRef, editorOnChange } from '../actions/editor';

const mapStateToProps = state => ({
  editorRef: state.editor.editorRef,
  editorState: state.editor.editorState,
});

const mapDispatchToProps = dispatch => ({
  refCallBack: ref => dispatch(saveEditorRef(ref)),
  onChange: editorState => dispatch(editorOnChange(editorState)),
  onFocus: ref => ref.focus(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
