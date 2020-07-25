import React from 'react';
import history from '../../history';
import moment from 'moment';
import { lang } from 'moment';

const UpcomingInterviewTable = props => {
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
      <button className='ui green button' onClick={() => joinRoom(value)}>
        Join
      </button>
    </>
  );

  const editButton = value => (
    <>
      <button className='ui button' onClick={() => editBookingForm(value)}>
        Reschedule
      </button>
    </>
  );

  const deleteButton = (bookingId, date) => (
    <>
      <button
        className='ui red button'
        onClick={() => props.onDelete(bookingId, date)}
      >
        Cancel
      </button>
    </>
  );

  const timingsToString = timings => {
    return timings.join(', ');
  };

  const langsToString = langs => {
    return langs.join(', ');
  };

  console.log(props.bookingArray);

  return (
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
                    time: timings
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
              <td>{deleteButton(bookingId, date)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UpcomingInterviewTable;
