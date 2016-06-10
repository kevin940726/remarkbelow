import React from 'react';
import { block } from './regex';


const blockRenderer = contentBlock => {
  const text = contentBlock.getText();

  if (block.blockquote.exec(text)) {
    block.blockquote.lastIndex = 0;

    // return {
    //   component: props => (
    //     <div>
    //       {props.block.get('text')}
    //     </div>
    //   ),
    // };
  }
};

export default blockRenderer;
