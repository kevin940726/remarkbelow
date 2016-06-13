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

This is a :telephone: :smiley[:D]:

    code

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


<<<<<<< HEAD
A [link](http://example.com).`
);

const findWithRegex = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr;
  let start;
  while ((matchArr = reg.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
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
      findWithRegex(regex.inline.indentation, contentBlock, callback),
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
  // {
  //   strategy: (contentBlock, callback) =>
  //     findWithRegex(regex.block.heading, contentBlock, callback),
  //   component: props => React.createElement(
  //     `h${props.level}`,
  //     { ...props },
  //     props.children
  //   ),
  //   props: {
  //     type: 'heading'
  //   }
  // },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.blockquote, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'blockquote' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.list, contentBlock, callback),
      component: props => {
        const text = props.children[0].props.text;
        var spaces = text.search(/\S/);
        if( spaces%2!==0 ){
          spaces+=1
        }
        spaces = spaces/2 %4
        return <span {...props} className={classNames(styles.token, styles[props.type], 'matched-'+spaces)}>
          {props.children}
        </span>
      },
      props: { type: 'list' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithTableRegex(regex.inline.table, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'table' }
  },
];

const regexDecorator = new CompositeDecorator([
  ...inlineDecorator,
  ...blockDecorator,
]);
=======
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
>>>>>>> 1a09fc79a4dd8d996a9757bbeae6876d303b567a

export default {
  editor: {
    editorState: EditorState.createWithContent(parsedContent, syntaxDecorator),
    viewEditorState: EditorState.createWithContent(parsedContent, renderDecorator),
  },
};
