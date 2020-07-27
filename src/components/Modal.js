import React from 'react';
import ReactDOM from 'react-dom';

const Modal = props => {
  return ReactDOM.createPortal(
    <div
      className='ui dimmer modals visible active'
      style={{ position: 'fixed', overflow: 'hidden' }}
    >
      <div className='ui standard full screen modal visible active'>
        <div
          className='ui center aligned header'
          style={{
            backgroundColor: `${props.color}`,
            color: `${props.headerColor}`
          }}
        >
          {props.description}
        </div>
        <div className='content'>{props.content}</div>
        <div className='actions'>{props.actions}</div>
      </div>
    </div>,
    document.querySelector('#modal')
  );
};

export default Modal;
