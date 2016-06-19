import React from 'react';
import { CompositeDecorator } from 'draft-js';
import styles from '../utils/prism.css';
import gfm from 'github-markdown-css';
import regex from '../utils/regex';
import emojiParser from 'emoji-parser';
import marked from 'marked';
import { Parser } from 'html-to-react';
import katex from 'katex';

emojiParser.init('app/emoji-parser').update(true, null, null);

const renderer = new marked.Renderer();

renderer.listitem = text => {
  const group = regex.block.taskList.exec(text);
  regex.block.taskList.lastIndex = 0;

  if (group) {
    return (
      /* eslint-disable max-len */
      `<li class="${gfm['task-list-item']}"><input type="checkbox" disabled="disabled" ${group[1] === 'x' && 'checked="checked"'} />${group[2]}</li>`
      /* eslint-disable max-len */
    );
  }

  return `<li>${text}</li>`;
};

const htmlToReactParser = Parser(React);

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

const InlineComponent = props => {
  const text = props.children[0].props.text;
  const group = regex.inline[props.type].exec(text);
  regex.inline[props.type].lastIndex = 0;

  if (props.type === 'strong') {
    return (<strong>{group[2]}</strong>);
  }
  else if (props.type === 'italic') {
    return (<em>{group[2]}</em>);
  }
  else if (props.type === 'strike') {
    return (<s>{group[2]}</s>);
  }
  else if (props.type === 'code') {
    return (<code>{group[2]}></code>);
  }

  return (<span>{text}</span>);
};

const findEmoji = (reg, contentBlock, callback) => {
  const text = contentBlock.getText();
  const textWithEmoji = emojiParser.parse(text, '');
  let matchArr;
  let offset = 0;
  while ((matchArr = regex.inline.img.exec(textWithEmoji)) !== null) {
    callback(matchArr.index - offset, matchArr.index - offset + matchArr[3].length);
    offset += matchArr[0].length - matchArr[3].length;
  }
};

const MarkedComponent = props => {
  const text = props.children[0].props.text;
  const html = marked(text, { renderer }).replace(/\n/g, '');

  return htmlToReactParser.parse(`<div>${html}</div>`);
};

const inlineDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.strong, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'strong' }
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
    component: InlineComponent,
    props: { type: 'code' }
  },
  {
    strategy: (contentBlock, callback) =>
      findEmoji(null, contentBlock, callback),
    component: props => {
      const emoji = emojiParser.parse(props.children[0].props.text, '../app/emoji-parser');
      const rex = /<img[^>]+src="([^">]+)" title="([^">]+)" alt="([^">]+)" \/>/g;
      const y = rex.exec(emoji);
      return (
        <img
          className={styles.emoji}
          src={y[1]}
          title={y[2]}
          alt={y[3]}
        />
      );
    },
    props: { type: 'emoji' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.link, contentBlock, callback),
    component: props => {
      const group = regex.inline.link.exec(props.children[0].props.text);
      regex.inline.link.lastIndex = 0;
      return (
        <a href={group[2]} target="_blank">
          {group[1]}
        </a>
      );
    },
    props: { type: 'link' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.inline.latex, contentBlock, callback),
    component: props => {
      const text = props.children[0].props.text;
      const html = katex.renderToString(text.substring(1, text.length - 1));
      return htmlToReactParser.parse(html);
    },
    props: { type: 'latex-inline' }
  },
];

const blockDecorator = [
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.heading, contentBlock, callback),
    component: props => {
      const group = regex.block.heading.exec(props.children[0].props.text);
      regex.block.heading.lastIndex = 0;
      return React.createElement(
        `h${group[1].length}`,
        props,
        props.children
      );
    },
    props: { type: 'heading' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.blockquote, contentBlock, callback),
    component: props => {
      const text = props.children[0].props.text;
      const blockquote = text.replace(/^>[\t ]*/gm, '');

      return (
        <blockquote>
          {blockquote}
        </blockquote>
      );
    },
    props: { type: 'blockquote' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.list, contentBlock, callback),
    component: MarkedComponent,
    props: { type: 'list' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.table, contentBlock, callback),
    component: MarkedComponent,
    props: { type: 'table' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.codeBlock, contentBlock, callback),
    component: props => {
      const text = props.children[0].props.text;
      const group = regex.block.codeBlock.exec(text);
      regex.block.codeBlock.lastIndex = 0;

      return (
        <pre {...props}>
          <code className={styles[`language-${group[2]}`]}>
            {group[3]}
          </code>
        </pre>
      );
    },
    props: { type: 'codeBlock' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.indentCodeBlock, contentBlock, callback),
    component: props => {
      const text = props.children[0].props.text;
      let match;
      const code = [];

      while (match = regex.block.indentCodeBlockCode.exec(text)) {
        code.push(match[1]);
      }
      regex.block.indentCodeBlockCode.lastIndex = 0;

      return (
        <pre {...props}>
          <code className={styles['language-']}>
            {code.join('\n')}
          </code>
        </pre>
      );
    },
    props: { type: 'codeBlock' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.img, contentBlock, callback),
    component: props => {
      const group = regex.block.img.exec(props.children[0].props.text);
      regex.block.img.lastIndex = 0;

      return (
        <img
          src={group[2]}
          alt={group[1]}
          title={group[4]}
        />
      );
    },
    props: { type: 'img' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.hr, contentBlock, callback),
    component: () => (<hr></hr>),
    props: { type: 'hr' }
  },
];

const syntaxDecorator = new CompositeDecorator([
  ...blockDecorator,
  ...inlineDecorator,
]);

export default syntaxDecorator;
