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

This is a :telephone:

:smiley[:D]:

Paragraphs are separated
by a blank line.

\`\`\`bash
$ npm install
$ npm start
\`\`\`

    indentation

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

let codeBlockMap = OrderedMap();
let listMap = OrderedMap();
let tableMap = OrderedMap();
let blockQuoteMap = OrderedMap();
const parsedText = defaultText
  .replace(regex.block.codeBlock, (match, p1, p2, p3, offset) => {
    codeBlockMap = codeBlockMap.set(offset.toString(), match.replace(/\n$/, ''));
    return `$$CODEBLOCK__${offset}$$`;
  })
  .replace(regex.block.list, (match, offset) => {
    listMap = listMap.set(offset.toString(), match.replace(/\n$/, ''));
    const lastChar = match.charAt(match.length - 1);
    return `$$LIST__${offset}$$${lastChar === '\n' && lastChar}`;
  })
  .replace(regex.block.table, (match, offset) => {
    tableMap = tableMap.set(offset.toString(), match.replace(/\n$/, ''));
    const lastChar = match.charAt(match.length - 1);
    return `$$TABLE__${offset}$$${lastChar === '\n' && lastChar}`;
  })
  .replace(regex.block.blockquote, (match, offset) => {
    blockQuoteMap = blockQuoteMap.set(offset.toString(), match.replace(/\n$/, ''));
    const lastChar = match.charAt(match.length - 1);
    return `$$BLOCKQUITE__${offset}$$${lastChar === '\n' && lastChar}`;
  });

const defaultContent = ContentState.createFromText(parsedText);

const tokenHackRegexes = [
  {
    withoutGroup: /\$\$BLOCKQUITE__\d+\$\$/g,
    withGroup: /\$\$BLOCKQUITE__(\d+)\$\$/g,
    mapObject: blockQuoteMap
  },
  {
    withoutGroup: /\$\$LIST__\d+\$\$/g,
    withGroup: /\$\$LIST__(\d+)\$\$/g,
    mapObject: listMap
  },
  {
    withoutGroup: /\$\$CODEBLOCK__\d+\$\$/g,
    withGroup: /\$\$CODEBLOCK__(\d+)\$\$/g,
    mapObject: codeBlockMap
  },
  {
    withoutGroup: /\$\$TABLE__\d+\$\$/g,
    withGroup: /\$\$TABLE__(\d+)\$\$/g,
    mapObject: tableMap
  },
];

let parsedContent = defaultContent;

tokenHackRegexes
  .forEach(re => {
    defaultContent.getBlockMap()
      .filter(block => block.getText().match(new RegExp(re.withoutGroup)))
      .forEach(block => {
        const text = block.getText();
        const match = new RegExp(re.withGroup).exec(text);
        parsedContent = Modifier.replaceText(
          parsedContent,
          SelectionState.createEmpty(block.getKey()).set('focusOffset', text.length),
          re.mapObject.get(match[1])
        );
      });
  });
/* ---------------------------------- */


export default {
  editor: {
    editorState: EditorState.createWithContent(parsedContent, syntaxDecorator),
    viewEditorState: EditorState.createWithContent(parsedContent, renderDecorator),
  },
};
