import { handleActions } from 'redux-actions';
import { EditorState } from 'draft-js';

export default handleActions({
  SAVE_EDITOR_REF: (state, action) => ({
    ...state,
    editorRef: action.payload,
  }),
  EDITOR_ON_CHANGE: (state, action) => ({
    ...state,
    editorState: action.payload,
  }),
  VIEW_EDITOR_ON_CHANGE: (state, action) => ({
    ...state,
    viewEditorState: action.payload,
  }),
}, {
  editorState: EditorState.createEmpty(),
});
