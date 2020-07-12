import React from 'react';
import history from '../../history';

const UpcomingInterviewTable = props => {
  console.log(props);
  const joinRoom = ({ bookingId, otherBookingId, date, time }) => {
    history.push({
      pathname: '/interview-room',
      state: {
        bookingId: bookingId,
        otherBookingId: otherBookingId,
        date,
        time
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

  const ediButton = ({
    bookingId,
    timings,
    topic,
    langs,
    otherAccType,
    date,
    timingsByBookingId
  }) => (
    <>
      <button
        className='ui button'
        onClick={() =>
          props.onReschedule({
            bookingId: bookingId,
            topicSelected: topic,
            accountTypeSelected: otherAccType,
            langSelected: langs,
            timings: timings,
            timingsByBookingId: timingsByBookingId,
            dateSelected: date
          })
        }
      >
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
          console.log(
            props.bookingsByBookingIdArray.filter(
              item => item.bookingId === bookingId
            )
          );
          return (
            <tr key={index}>
              <td>{date}</td>
              <td>{topic}</td>
              <td>{langsToString(langs)}</td>
              <td>{timingsToString(timings)}</td>
              <td>
                {joinRoomButton({
                  bookingId: bookingId,
                  otherBookingId: otherBookingId,
                  date,
                  time: timings
                })}
              </td>
              <td>
                {ediButton({
                  bookingId: bookingId,
                  timings: timings,
                  timingsByBookingId: props.bookingsByBookingIdArray.filter(
                    item => item.bookingId === bookingId
                  ),
                  topic: topic,
                  langs: langs,
                  otherAccType: otherAccType,
                  date: date
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
