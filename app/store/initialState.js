import React from 'react';
import { EditorState, ContentState } from 'draft-js';
import { List, Repeat, Range } from 'immutable';
const Prism = require('../utils/prism.js');
import styles from '../utils/prism.css';
import classNames from 'classnames';

const Decorator = () => ({
  getDecorations: (block) => {
    const text = block.getText();
    let decorations = List(Repeat(null, text.length));

    const highlight = Prism.tokenize(text, Prism.languages.markdown);

    console.log(highlight);

    let offset = 0;
    highlight.forEach(token => {
      if (typeof token === 'string') {
        offset += token.length;
      }
      else {
        const len = token.matchedStr.length;
        if (decorations.slice(offset, offset + len).every(d => d === null)) {
          Range(offset, offset + len).toArray().forEach(i => {
            decorations = decorations.set(i, `${token.type}.${token.alias}`);
          });
        }

        offset += len;
      }
    });

    return decorations;
  },

  getComponentForKey: () => props => (
    <span className={classNames(styles.token, ...props.type.map(type => styles[type]))}>
      {props.children}
    </span>
  ),
  getPropsForKey: key => ({ type: key.split('.') }),
});

const defaultContent = ContentState.createFromText(
`# Heading
=======
## Sub-heading
-----------
### Another deeper heading

Paragraphs are separated
by a blank line.

Two spaces at the end of a line leave a
line break.

Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`.

Horizontal rule:

---

Bullet list:

  * apples
  * oranges
  * pears

Numbered list:

  1. apples
  2. oranges
  3. pears

A [link](http://example.com).`
);

const decorator = Decorator();

export default {
  editor: {
    editorState: EditorState.createWithContent(defaultContent, decorator),
  },
};
