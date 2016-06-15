import React from 'react';
import syntax from './syntax.css';

const blockRenderer = contentBlock => {
  const text = contentBlock.getText();

  return {
    component: props => (
      <div className={syntax.block}>
        {text}
      </div>
    ),
  };
};

export default blockRenderer;
