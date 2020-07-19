import React from 'react';
import './InterviewRoom.css';

const SubHeader = props => {
  const { onClick, role, hasSwitched } = props;
  console.log(hasSwitched);

  const switchButton = !hasSwitched
    ? 'compact ui medium right labeled icon button'
    : 'compact ui medium right labeled icon disabled button';
  return (
    <div className='subheader-text'>
      <div className='ui right aligned container'>
        <p style={{ fontSize: '18px' }}>
          It’s your peer’s turn to interview you. Click on swap roles once you
          have completed the question.
        </p>
      </div>
      <div className='ui right aligned container' style={{ width: '270px' }}>
        <button
          className={switchButton}
          onClick={() =>
            onClick(role === 'interviewee' ? 'interviewer' : 'interviewee')
          }
        >
          Swap roles
          <i className='exchange alternate icon' />
        </button>
      </div>
    </div>
  );
};

export default SubHeader;
