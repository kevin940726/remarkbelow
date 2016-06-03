import React from 'react';
import { EditorState, ContentState, CompositeDecorator } from 'draft-js';
import { List, Repeat, Range } from 'immutable';
const Prism = require('../utils/prism.js');
import styles from '../utils/prism.css';
import classNames from 'classnames';
import regex from '../utils/regex';

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

Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`, ~~strike~~.

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

const findWithRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = reg.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const InlineComponent = props => (
  <span {...props} className={classNames(styles.token, styles[props.type])}>
    {props.children}
  </span>
);

const inlineDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.strong, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'bold' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.italic, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'italic' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.strike, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'strike' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.code, contentBlock, callback),
    component: props => (
      <code {...props} className="language-">
        {props.children}
      </code>
    ),
    props: { type: 'code' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.link, contentBlock, callback),
    component: props => (
      <a href={props.href} target="_blank">
        {props.children}
      </a>
    ),
    props: {
      type: 'link',
      href: '#'
    }
  },
];

// const blockDecorator = [
//   {
//     strategy: (contentBlock, callback) =>
//       findWithRegex(regex.block.heading, contentBlock, callback),
//     component: props => React.createElement(
//       `h${props.level}`,
//       { ...props },
//       props.children
//     ),
//     props: {
//       type: 'code'
//     }
//   }
// ];

const regexDecorator = new CompositeDecorator([
  ...inlineDecorator,
]);

export default {
  editor: {
    editorState: EditorState.createWithContent(defaultContent, regexDecorator),
  },
};
