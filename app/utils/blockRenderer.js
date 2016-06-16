import React from 'react';
import syntax from './syntax.css';

const blockRenderer = contentBlock => {
  const text = contentBlock.getText();

  return {
    component: () => (
      <div className={syntax.block}>
        {text}
      </div>
    ),
  };
};

export default blockRenderer;
