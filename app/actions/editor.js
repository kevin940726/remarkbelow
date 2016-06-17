import { createAction } from 'redux-actions';

export const saveEditorRef = createAction('SAVE_EDITOR_REF');

export const editorOnChange = createAction('EDITOR_ON_CHANGE');

export const viewEditorOnChange = createAction('VIEW_EDITOR_ON_CHANGE');

export const openFromText = createAction('OPEN_FROM_TEXT');
