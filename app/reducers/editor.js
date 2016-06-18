import { handleActions } from 'redux-actions';
import { EditorState } from 'draft-js';
import createStateFromText from '../utils/createEditorState';

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
  OPEN_FROM_TEXT: (state, action) => ({
    ...state,
    ...createStateFromText(action.payload),
  }),
  SCROLL_TO: (state, action) => ({
    ...state,
    scrollTopKey: action.payload,
  }),
}, {
  editorState: EditorState.createEmpty(),
});
