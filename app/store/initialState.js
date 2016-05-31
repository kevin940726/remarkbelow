import React from 'react';
import { EditorState, ContentState, CompositeDecorator } from 'draft-js';
import { List, Repeat, Range } from 'immutable';
const Prism = require('../utils/prism.js');

const Decorator = () => ({
  getDecorations: (block) => {
    const text = block.getText();
    let decorations = List(Repeat(null, text.length));

    const highlight = Prism.tokenize(text, Prism.languages.markdown);

    let offset = 0;
    highlight.forEach(token => {
      if (typeof token === 'string') {
        offset += token.length;
      }
      else {
        const len = token.matchedStr.length;
        if (decorations.slice(offset, offset + len).every(d => d === null)) {
          Range(offset, offset + len).toArray().map(i => {
            decorations = decorations.set(i, token.type);
          });
        }

        offset += len;
      }
    });

    return decorations;
  },

  getComponentForKey: () => props => (
    <span className={'matched ' + props.type}>
      {props.children}
    </span>
  ),
  getPropsForKey: key => ({ type: key }),
});

const defaultContent = ContentState.createFromText(`Hello **World**!`);

const decorator = Decorator();

export default {
  editor: {
    editorState: EditorState.createWithContent(defaultContent, decorator),
  },
};
