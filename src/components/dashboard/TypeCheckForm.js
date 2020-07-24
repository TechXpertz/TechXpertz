import React, { useState } from 'react';
import Modal from '../Modal';

const TypeCheckForm = props => {
  const [accountType, setAccountType] = useState('');

  if (props.type !== 'AccountType' || props.hasSubmittedForm) {
    return null;
  }

  const submitButton =
    accountType === '' ? 'ui primary disabled button' : 'ui primary button';

  const checkType = type => {
    props.onTypeClick(type);
    setAccountType('');
  };

  const modalContent = (
    <>
      <div className='ui relaxed items'>
        <h3 className='ui center aligned header'>Choose your account type:</h3>
        <div className='item'>
          <div className='ui checkbox' style={{ left: '23em' }}>
            <input
              type='checkbox'
              onChange={() => setAccountType('Normal')}
              checked={accountType === 'Normal' ? 'Normal' : ''}
            />
            <label>Normal</label>
          </div>
        </div>
        <div className='item'>
          <div className='ui checkbox' style={{ left: '23em' }}>
            <input
              type='checkbox'
              onChange={() => setAccountType('Expert')}
              checked={accountType === 'Expert' ? 'Expert' : ''}
            />
            <label>Expert (working in top-tier company)</label>
          </div>
        </div>
      </div>
    </>
  );

  const actions = (
    <>
      <div className='ui center aligned container'>
        <button className='ui button'>Cancel</button>
        <button className={submitButton} onClick={() => checkType(accountType)}>
          Next
        </button>
      </div>
    </>
  );

  return (
    <Modal
      color='white'
      headerColor='black'
      description='Tell Us About Your Background'
      content={modalContent}
      actions={actions}
    />
  );
};

export default TypeCheckForm;
