import React from 'react';
import { EditorState, ContentState, CompositeDecorator, Modifier, SelectionState } from 'draft-js';
import styles from '../utils/prism.css';
import classNames from 'classnames';
import regex from '../utils/regex';
import { OrderedMap } from 'immutable';

const defaultText =
`# Heading
=======
## Sub-heading
-----------
### Another deeper heading

Paragraphs are separated
by a blank line.

\`\`\`bash
$ npm install
$ npm start
\`\`\`

Two spaces at the end of a line leave a
line break.

Text attributes _italic_, *italic*, __bold__, **bold**, \`monospace\`, ~~strike~~.

Horizontal rule:
---

img:
![alt text](http://path/to/img.jpg "Title")

taskList:
- [ ] dick
- [x] fuck

\`\`\`js
const foo = 'bar';
foo.replace(/b/, 'c');
\`\`\`

Bullet list:

  * apples
  * oranges
  * pears
    * apples
    * oranges
    * pears
      * apples
      * oranges
      * pears
        * apples
        * oranges
        * pears

Numbered list:

  1. apples
    1. apples
    2. oranges
    3. pears
      1. apples
      2. oranges
      3. pears
        1. apples
        2. oranges
        3. pears
  2. oranges
  3. pears

| Tables        | Are           | Cool  |
|---------------|:-------------:|-------|
| col 3 is      |    r-l        | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

> ar en resnksndf sdpofmopsdmf
sdlknksdnkf
> wofnosidn oi
> oejfosf

> ijewnef
> kneinfie

reist

> sfosdnf
>wnfoefm


A [link](http://example.com).`;

let codeBlockMap = OrderedMap();
const parsedText = defaultText.replace(regex.block.codeBlock, (match, p1, p2, p3, offset) => {
  codeBlockMap = codeBlockMap.set(offset.toString(), match);
  return `$$CODEBLOCK__${offset}$$`;
});

const defaultContent = ContentState.createFromText(parsedText);

let parsedContent = defaultContent;
defaultContent.getBlockMap()
  .filter(block => block.getText().match(/\$\$CODEBLOCK__\d+\$\$/g))
  .forEach(block => {
    parsedContent = Modifier.replaceText(
      parsedContent,
      SelectionState.createEmpty(block.getKey()).set('focusOffset', block.getText().length),
      codeBlockMap.get(/\$\$CODEBLOCK__(\d+)\$\$/g.exec(block.getText())[1])
    );
  });

const findWithRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = reg.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

const findWithBlockRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  if (text.match(reg)) {
    callback(0, text.length);
  }
};

const findWithTableRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  while ((matchArr = reg.exec(text)) !== null) {
    matchArr = matchArr[0].split('|');
    matchArr = matchArr.filter(x => x);
    let offset = 0;
    matchArr.forEach((match) => {
      if (text[offset] === '|') {
        offset += 1;
      }
      let end = offset + match.length;
      end = end < 0 ? 0 : end;
      callback(offset, end);
      offset = end;
    });
  }
};

const InlineComponent = props => (
  <span {...props} className={classNames(styles.token, styles[props.type])}>
    {props.children}
  </span>
);

const BlockComponent = props => (
  <div {...props} className={classNames(styles.token, styles[props.type])}>
    {props.children}
  </div>
);

const inlineDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.hr, contentBlock, callback),
    component: props => (
      <hr className={classNames(styles.token, styles[props.type])}>
      </hr>
    ),
    props: { type: 'hr' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.img, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'img' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.taskList, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'taskList' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.taskListx, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'taskListx' }
  },
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
    component: props => {
      const group = regex.inline.link.exec(props.children[0].props.text);
      return (
        <a href={group[2]} target="_blank">
          {props.children}
        </a>
      );
    },
    props: { type: 'link' }
  },
];

const blockDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.heading, contentBlock, callback),
    component: BlockComponent,
    props: { type: 'heading' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.blockquote, contentBlock, callback),
    component: BlockComponent,
    props: { type: 'blockquote' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.list, contentBlock, callback),
    component: props => {
      const text = props.children[0].props.text;
      let spaces = text.search(/\S/);
      if (spaces % 2 !== 0) {
        spaces += 1;
      }
      spaces = spaces / 2 % 4;
      return (
        <span
          {...props}
          className={classNames(
            styles.token,
            styles[props.type],
            `matched-${spaces}`,
          )}
        >
          {props.children}
        </span>
      );
    },
    props: { type: 'list' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithTableRegex(regex.block.table, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'table' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.codeBlock, contentBlock, callback),
    component: props => (
      <pre {...props} className="languages-">
        {props.children}
      </pre>
    ),
    props: { type: 'codeBlock' }
  }
];

const regexDecorator = new CompositeDecorator([
  ...inlineDecorator,
  ...blockDecorator,
]);

export default {
  editor: {
    editorState: EditorState.createWithContent(parsedContent, regexDecorator),
  },
};
