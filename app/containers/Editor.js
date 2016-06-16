import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { saveEditorRef, editorOnChange, viewEditorOnChange } from '../actions/editor';
import { RichUtils, EditorState, Modifier } from 'draft-js';
import { block } from '../utils/regex';
import renderDecorator from '../utils/renderDecorator';

const mapStateToProps = state => ({
  editorRef: state.editor.editorRef,
  editorState: state.editor.editorState,
});

const mapDispatchToProps = dispatch => ({
  refCallBack: ref => dispatch(saveEditorRef(ref)),
  onChange: editorState => {
    dispatch(editorOnChange(editorState));
    setTimeout(() => {
      dispatch(viewEditorOnChange(
        EditorState.createWithContent(editorState.getCurrentContent(), renderDecorator)
      ));
    });
  },
  onFocus: ref => ref.focus(),
  handleReturn: editorState => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const contentBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    const text = contentBlock.getText();
    const curText = text.charAt(selection.getAnchorOffset() - 1);

    if (text.match(block.codeBlockStart) ||
      text.match(block.list) ||
      text.match(block.table) ||
      text.match(block.blockquote) ||
      text.match(block.indentCodeBlock)
    ) {
      if (curText === '\n') {
        const newContentState = Modifier.splitBlock(
          currentContent,
          selection.set('anchorOffset', selection.getAnchorOffset() - 1)
        );
        const newEditorState = EditorState.push(editorState, newContentState, 'split-block');
        dispatch(editorOnChange(newEditorState));
        return true;
      }

      const newEditorState = RichUtils.insertSoftNewline(editorState);
      dispatch(editorOnChange(newEditorState));
      return true;
    }

    return false;
  },
  onTab: editorState => {
    const insertedTabContent = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '    '
    );

    const insertedTabState = EditorState.push(
      editorState,
      insertedTabContent,
      'insert-characters'
    );
    dispatch(editorOnChange(insertedTabState));
    setTimeout(() => {
      dispatch(viewEditorOnChange(
        EditorState.createWithContent(insertedTabState.getCurrentContent(), renderDecorator)
      ));
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
