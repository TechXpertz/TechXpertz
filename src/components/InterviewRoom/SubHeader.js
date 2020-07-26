import React, { useState } from 'react';
import Modal from '../Modal';
import './InterviewRoom.css';

const SubHeader = props => {
  const [openModal, setOpenModal] = useState(false);
  const { onClick, role, disableSwitch } = props;

  const instruction = role === 'interviewee'
    ? "It’s your peer’s turn to interview you. "
    + "Click on swap roles or exit session once you have completed the question."
    : "It's your turn to interview your peer. "
    + "Click on swap roles or exit session once your peer has completed the question";

  const actions = (
    <>
      <button className='ui button' onClick={() => setOpenModal(!openModal)}>
        No
      </button>
      <button
        className='ui primary button'
        onClick={() => onClick(onConfirmClick)}
      >
        Yes
      </button>
    </>
  );

  const content = (
    <div className='swap-role-container'>
      <span>
        By clicking yes, you will now assume the role of being the{' '}
        {role === 'interviewee' ? 'interviewer' : 'interviewee'}
      </span>
    </div>
  );

  const onSwitchRoleClick = () => {
    setOpenModal(!openModal);
  };

  const onConfirmClick = () => {
    onClick(role === 'interviewee' ? 'interviewer' : 'interviewee');
    setOpenModal(!openModal);
  };

  const switchButton = !disableSwitch
    ? 'compact ui medium right labeled icon button'
    : 'compact ui medium right labeled icon disabled button';

  return (
    <>
      {openModal && (
        <Modal
          color='#4085CA'
          headerColor='white'
          description='Are you sure you want to swap roles?'
          actions={actions}
          content={content}
        />
      )}
      <div className='subheader-text'>
        <div className='ui right aligned container'>
          <p style={{ fontSize: '18px' }}>
            {instruction}
          </p>
        </div>
        <div className='ui right aligned container' style={{ width: '270px' }}>
          <button className={switchButton} onClick={onSwitchRoleClick}>
            Swap roles
            <i className='exchange alternate icon' />
          </button>
        </div>
      </div>
    </>
  );
};

export default SubHeader;
