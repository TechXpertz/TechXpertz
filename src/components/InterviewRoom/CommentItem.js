import React from 'react';

const CommentItem = ({ time, comment, role }) => {
  return (
    <div className='content'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        <div className='author' style={{ fontWeight: 'bold' }}>
          {role}
        </div>
        <span
          className='date'
          style={{ color: '#BEBEBE', fontSize: '12px', marginLeft: '5px' }}
        >
          {time}
        </span>
      </div>
      <div className='text'>{comment}</div>
    </div>
  );
};

export default CommentItem;
