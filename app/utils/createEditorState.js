import { EditorState, ContentState, Modifier, SelectionState } from 'draft-js';
import regex from '../utils/regex';
import { OrderedMap } from 'immutable';
import syntaxDecorator from '../utils/syntaxDecorator';
import renderDecorator from '../utils/renderDecorator';


const createStateFromText = defaultText => {
  if (!defaultText) {
    return {
      editorState: EditorState.createEmpty(syntaxDecorator),
      viewEditorState: EditorState.createEmpty(renderDecorator),
    };
  }

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
    })
    .replace(regex.block.indentCodeBlock, (match, p1, p2, offset) => {
      codeBlockMap = codeBlockMap.set(offset.toString(), match.replace(/\n+$/, ''));
      const trailingNewLine = /(\n+)$/.exec(match);
      return `$$CODEBLOCK__${offset}$$${trailingNewLine && trailingNewLine[1]}`;
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

  return {
    editorState: EditorState.createWithContent(parsedContent, syntaxDecorator),
    viewEditorState: EditorState.createWithContent(parsedContent, renderDecorator),
  };
};

export default createStateFromText;
