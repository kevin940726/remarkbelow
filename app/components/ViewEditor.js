import React from 'react';
import { findDOMNode } from 'react-dom';
import { Editor as DraftEditor } from 'draft-js';
import { editor, viewEditor } from './Editor.css';
import styles from 'github-markdown-css';
import classNames from 'classnames';
import syntax from '../utils/syntax.css';

// const smoothScrollTo = (node, target) => {
//   const range = target - node.scrollTop;
//   const step = range / 10;
//   let cur = 0;
//
//   const timer = setInterval(() => {
//     node.scrollTop += step; // eslint-disable-line no-param-reassign
//     cur += 1;
//
//     if (cur >= 10) {
//       clearInterval(timer);
//     }
//   }, 16);
//
//   return timer;
// };

class ViewEditor extends React.Component {
  componentDidUpdate(prevProps) {
    const { scrollTopKey } = this.props;

    if (scrollTopKey && scrollTopKey !== prevProps.scrollTopKey) {
      const node = findDOMNode(this);
      const topBlock = [].slice.call(node.querySelectorAll(`.${syntax.viewBlock}`))
        .find(b => b.dataset.offsetKey.substr(0, 5) === scrollTopKey);

      if (topBlock) {
        // clearInterval(this.state.timer);
        // this.setState({
        //   timer: smoothScrollTo(node, topBlock.offsetTop)
        // });
        node.scrollTop = topBlock.offsetTop;
      }
    }
  }

  render() {
    const { editorState } = this.props;
    return (
      <div className={classNames(editor, viewEditor, styles['markdown-body'])}>
        <DraftEditor
          editorState={editorState}
          blockStyleFn={() => syntax.viewBlock}
          readOnly
        />
      </div>
    );
  }
}

export default ViewEditor;
