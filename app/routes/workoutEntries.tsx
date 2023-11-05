import React from 'react';

const TwoColumnLayout: React.FC = () => {
  return (
    <div className='page-container'>
      <div className='column column-a'>Content for column A</div>
      <div className='column column-b'>Content for column B</div>
    </div>
  );
};

export default TwoColumnLayout;
