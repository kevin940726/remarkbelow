import React from 'react';
import { Editor as DraftEditor } from 'draft-js';

const View = ({ editorState }) => (
  <DraftEditor editorState={editorState} />
);

export default View;
