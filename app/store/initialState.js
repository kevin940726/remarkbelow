import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js';
import regex from '../utils/regex';
import { OrderedMap } from 'immutable';
import syntaxDecorator from '../utils/syntaxDecorator';
import renderDecorator from '../utils/renderDecorator';

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
![alt text](https://pbs.twimg.com/profile_images/378800000822867536/3f5a00acf72df93528b6bb7cd0a4fd0c.jpeg "Title")

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

/* --- codeBlock block workaround --- */
let codeBlockMap = OrderedMap();
let parsedText = defaultText.replace(regex.block.codeBlock, (match, p1, p2, p3, offset) => {
  codeBlockMap = codeBlockMap.set(offset.toString(), match);
  return `$$CODEBLOCK__${offset}$$`;
});
/* --- list block workaround --- */
let listMap = OrderedMap();
parsedText = defaultText.replace(regex.block.list, (match, offset) => {
  listMap = listMap.set(offset.toString(), match);
  console.log(match)
  return `$$LIST__${offset}$$`;
});

let tableMap = OrderedMap();
parsedText = defaultText.replace(regex.block.table, (match, offset) => {
  tableMap = tableMap.set(offset.toString(), match);
  console.log(match)
  return `$$TABLE__${offset}$$`;
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
defaultContent.getBlockMap()
  .filter(block => block.getText().match(/\$\$LIST__\d+\$\$/g))
  .forEach(block => {
    parsedContent = Modifier.replaceText(
      parsedContent,
      SelectionState.createEmpty(block.getKey()).set('focusOffset', block.getText().length),
      listMap.get(/\$\$LIST__(\d+)\$\$/g.exec(block.getText())[1])
    );
  });
defaultContent.getBlockMap()
  .filter(block => block.getText().match(/\$\$TABLE__\d+\$\$/g))
  .forEach(block => {
    parsedContent = Modifier.replaceText(
      parsedContent,
      SelectionState.createEmpty(block.getKey()).set('focusOffset', block.getText().length),
      tableMap.get(/\$\$TABLE__(\d+)\$\$/g.exec(block.getText())[1])
    );
  });
/* ---------------------------------- */

export default {
  editor: {
    editorState: EditorState.createWithContent(parsedContent, syntaxDecorator),
    viewEditorState: EditorState.createWithContent(parsedContent, renderDecorator),
  },
};
