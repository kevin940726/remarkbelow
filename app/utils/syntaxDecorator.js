import React from 'react';
import { CompositeDecorator } from 'draft-js';
import styles from '../utils/prism.css';
import classNames from 'classnames';
import regex from '../utils/regex';

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
      regex.inline.link.lastIndex = 0;
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
      findWithRegex(regex.block.hr, contentBlock, callback),
    component: props => (
      <span className={classNames(styles.token, styles[props.type])}>
        {props.children}
      </span>
    ),
    props: { type: 'hr' }
  },
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
      findWithRegex(regex.block.img, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'img' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.taskList, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'taskList' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithRegex(regex.block.taskListx, contentBlock, callback),
    component: InlineComponent,
    props: { type: 'taskListx' }
  },
  {
    strategy: (contentBlock, callback) =>
      findWithBlockRegex(regex.block.codeBlock, contentBlock, callback),
    component: props => (
      <div {...props} className="languages-">
        {props.children}
      </div>
    ),
    props: { type: 'codeBlock' }
  },
];

const syntaxDecorator = new CompositeDecorator([
  ...blockDecorator,
  ...inlineDecorator,
]);

export default syntaxDecorator;
