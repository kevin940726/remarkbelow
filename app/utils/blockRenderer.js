import React from 'react';
import { Editor as DraftEditor, EditorState, ContentState } from 'draft-js';
import { block } from './regex';

class BlockQuote extends React.Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onKeyDown(event) {
    console.log(event);
  }
  onChange(event) {
    console.log(event);
  }

  render() {
    return (
      <blockquote onKeyDown={this.onKeyDown} onChange={this.onChange}>
        {this.props.block.get('text')}
      </blockquote>
    );
  }
}

const blockRenderer = contentBlock => {
  const text = contentBlock.getText();

  if (block.blockquote.exec(text)) {
    block.blockquote.lastIndex = 0;

    return {
      component: BlockQuote,
    };
  }
};

export default blockRenderer;
