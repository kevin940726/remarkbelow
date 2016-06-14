import React from 'react';
import { CompositeDecorator } from 'draft-js';
import styles from '../utils/prism.css';
import classNames from 'classnames';
import regex from '../utils/regex';
import emojiParser from 'emoji-parser';

emojiParser.init('app/emoji-parser').update(true, null, null);

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

let findWithTableRegex = (reg, contentBlock, callback) => {
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
      findEmoji(null, contentBlock, callback),
    component: props => {
      const emoji = emojiParser.parse(props.children[0].props.text, '../app/emoji-parser');
      const rex = /<img[^>]+src="([^">]+)" title="([^">]+)" alt="([^">]+)" \/>/g;
      const y = rex.exec(emoji);
      return (
        <img
          src={y[1]}
          title={y[2]}
          alt={y[3]}
        />
      );
    },
    props: { type: 'code' }
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
    component: props => (
      <blockquote>
        {props.children}
      </blockquote>
    ),
    props: { type: 'blockquote' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.list, contentBlock, callback),
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
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.img, contentBlock, callback),
    component: props => {
      const group = regex.block.img.exec(props.children[0].props.text);
      regex.block.img.lastIndex = 0;

      return (
        <img
          className={styles.img}
          src={group[2]}
          alt={group[1]}
          title={group[4]}
        />
      );
    },
    props: { type: 'img' }
  },
];

const syntaxDecorator = new CompositeDecorator([
  ...blockDecorator,
  ...inlineDecorator,
]);

export default syntaxDecorator;
