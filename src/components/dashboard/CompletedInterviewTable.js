import React, { useState } from 'react';
import Modal from '../Modal';

const CompletedInterviewTable = props => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContentIndex, setModalContentIndex] = useState(null);
  const { pastInterviewArray } = props;

  //event handlers//
  const viewHandler = index => {
    setOpenModal(!openModal);
    setModalContentIndex(index);
  };

  //html components//
  const actions = (
    <>
      <button className='ui red button' onClick={() => viewHandler(null)}>
        Close
      </button>
    </>
  );

  const content = () => (
    <>
      <div className='ui grid'>
        <div className='row'>
          <div className='three wide column'>Correctness:</div>
          <div className='ten wide column'>
            {modalContentIndex !== null
              ? pastInterviewArray[modalContentIndex].feedback.comment
                .correctnessFeedback
              : null}
          </div>
        </div>
        <div className='row'>
          <div className='three wide column'>Clarity:</div>
          <div className='ten wide column'>
            {modalContentIndex !== null
              ? pastInterviewArray[modalContentIndex].feedback.comment
                .clarityFeedback
              : null}
          </div>
        </div>
        <div className='row'>
          <div className='three wide column'>Behavioural:</div>
          <div className='ten wide column'>
            {modalContentIndex !== null
              ? pastInterviewArray[modalContentIndex].feedback.comment
                .behaviouralFeedback
              : null}
          </div>
        </div>
        <div className='row'>
          <div className='three wide column'>Others:</div>
          <div className='ten wide column'>
            {modalContentIndex !== null
              ? pastInterviewArray[modalContentIndex].feedback.comment.others
              : null}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {openModal && (
        <Modal
          color='#4085CA'
          headerColor='white'
          description='Complete Feedback'
          actions={actions}
          content={content(modalContentIndex)}
        />
      )}
      <table className='ui six column compact table'>
        <thead style={{ backgroundColor: '#E1E1E1 !important' }}>
          <tr style={{ color: '#F9F9F9' }}>
            <th className='three wide'>Date</th>
            <th className='three wide'>Topic</th>
            <th className='two wide' style={{ textAlign: 'center' }}>
              Correctness
            </th>
            <th className='two wide' style={{ textAlign: 'center' }}>
              Clarity
            </th>
            <th className='two wide' style={{ textAlign: 'center' }}>
              Behavioural
            </th>
            <th className='two wide'></th>
          </tr>
        </thead>
        <tbody>
          {pastInterviewArray.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.topic}</td>
                <td style={{ textAlign: 'center' }}>
                  {!item.feedback ? '-' : item.feedback.rate.correctnessRate}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {!item.feedback ? '-' : item.feedback.rate.clarityRate}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {!item.feedback ? '-' : item.feedback.rate.behaviouralRate}
                </td>
                <td>
                  <button
                    className={item.feedback ? 'ui primary button' : 'ui primary disabled button'}
                    onClick={() => viewHandler(index)}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CompletedInterviewTable;
