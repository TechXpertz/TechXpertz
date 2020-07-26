import './Dashboard.css';
import React, { useState } from 'react';
import Modal from '../Modal';
import history from '../../history';
import moment from 'moment';

const UpcomingInterviewTable = props => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({});
  const now = moment(new Date());

  const joinRoom = ({ bookingId, otherBookingId, date, time }) => {
    history.push({
      pathname: '/interview-room',
      state: {
        bookingId: bookingId,
        otherBookingId: otherBookingId,
        date,
        time,
        username: props.username
      }
    });
  };

  const editBookingForm = ({
    bookingId,
    topicSelected,
    langsSelected,
    accSelected
  }) => {
    history.push({
      pathname: '/update-booking',
      state: {
        bookingId: bookingId,
        topicSelected: topicSelected,
        langsSelected: langsSelected,
        accSelected: accSelected,
        reschedule: true
      }
    });
  };

  const joinRoomButton = value => (
    <>
      <button
        className={
          'ui green' + (value.disabled ? ' disabled button' : ' button')
        }
        onClick={() => joinRoom(value)}
      >
        Join
      </button>
    </>
  );

  const onDelete = value => {
    setDeleteInfo(value);
    setDeleteModalOpen(!deleteModalOpen);
  };

  const onCancelDelete = () => {
    setDeleteInfo({});
    setDeleteModalOpen(!deleteModalOpen);
  };

  const onConfirmDelete = value => {
    props.onDelete(value.bookingId, value.date);
    setDeleteInfo({});
    setDeleteModalOpen(!deleteModalOpen);
  };

  const editButton = value => (
    <>
      <button className='ui button' onClick={() => editBookingForm(value)}>
        Reschedule
      </button>
    </>
  );

  const deleteButton = ({ bookingId, date, timings, topic, langs }) => (
    <>
      <button
        className='ui red button'
        onClick={() => onDelete({ bookingId, date, timings, topic, langs })}
        // onClick={() => props.onDelete(bookingId, date)}
      >
        Cancel
      </button>
    </>
  );

  // const deleteModalActions = (
  //   <>
  //     <button className='ui button' onClick={onCancelDelete}>
  //       No
  //     </button>
  //     <button className='ui red button' onClick={onConfirmDelete}>Yes</button>
  //   </>
  // );

  const DeleteModal = value => {
    const { bookingId, date, langs, timings, topic } = value.deleteContent;
    const content = (
      <div className='delete-modal-container'>
        <div className='delete-modal-inner-container'>
          <div className='delete-modal-content'>
            <h4 className='delete-modal-subheaders'>Date: &nbsp;</h4>
            <span>{date}</span>
          </div>
          <div className='delete-modal-content'>
            <h4 className='delete-modal-subheaders'>Timings: &nbsp;</h4>
            <span>{timings}</span>
          </div>
          <div className='delete-modal-content'>
            <h4 className='delete-modal-subheaders'>Topic: &nbsp;</h4>
            <span>{topic}</span>
          </div>
          <div className='delete-modal-content'>
            <h4 className='delete-modal-subheaders'>
              Programming Language: &nbsp;
            </h4>
            <span>{langs}</span>
          </div>
        </div>
      </div>
    );

    const deleteModalActions = (
      <>
        <button className='ui button' onClick={onCancelDelete}>
          No
        </button>
        <button
          className='ui red button'
          onClick={() => onConfirmDelete({ bookingId, date })}
        >
          Yes
        </button>
      </>
    );

    return (
      <Modal
        color='#CA3333'
        headerColor='white'
        description='Are you sure you want to delete the following booking?'
        actions={deleteModalActions}
        content={content}
      />
    );
  };

  const timingsToString = timings => {
    return timings.join(', ');
  };

  const langsToString = langs => {
    return langs.join(', ');
  };

  return (
    <>
      {deleteModalOpen && <DeleteModal deleteContent={deleteInfo} />}
      <table className='ui seven column compact table'>
        <thead>
          <tr>
            <th className='three wide'>Date</th>
            <th className='three wide'>Topic</th>
            <th className='three wide'>Language</th>
            <th className='four wide'>Timing</th>
            <th className='one wide'></th>
            <th className='one wide'></th>
            <th className='one wide'></th>
          </tr>
        </thead>
        <tbody>
          {props.bookingArray.map((booking, index) => {
            const {
              bookingId,
              date,
              otherBookingId,
              otherAccType,
              timings,
              topic,
              langs
            } = booking;
            const interviewTime = moment(timings[0], ['h:mm A']);
            const diff = moment.duration(interviewTime.diff(now)).asMinutes();
            const disabled = diff > 5;
            return (
              <tr key={index}>
                <td>{date}</td>
                <td>{topic}</td>
                <td>{langsToString(langs)}</td>
                <td>{timingsToString(timings)}</td>
                <td>
                  {otherBookingId &&
                    joinRoomButton({
                      bookingId: bookingId,
                      otherBookingId: otherBookingId,
                      date,
                      time: timings,
                      disabled: disabled
                    })}
                </td>
                <td>
                  {editButton({
                    bookingId: bookingId,
                    topicSelected: topic,
                    langsSelected: langs,
                    accSelected: otherAccType
                  })}
                </td>
                <td>
                  {deleteButton({
                    bookingId: bookingId,
                    date: date,
                    timings: timingsToString(timings),
                    topic: topic,
                    langs: langsToString(langs)
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default UpcomingInterviewTable;
