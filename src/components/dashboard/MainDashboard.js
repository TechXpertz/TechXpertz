import React, { useState, useRef, useEffect } from 'react';
import UpcomingInterviewTable from './UpcomingInterviewTable';
import CompletedInterviewTable from './CompletedInterviewTable';
import LoaderPage from '../LoaderPage';
import history from '../../history';
import './Dashboard.css';
import {
  getUpcomingBookings,
  bookingsUrl,
  getPastInterviews,
  getAccType,
  getUsername
} from '../../api_callers/apis.json';
import axios from 'axios';
import { useAuth0 } from '../../react-auth0-spa';

const MainDashboard = () => {
  const headerRef = useRef(null);
  const [headerWidth, setHeaderWidth] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [username, setUsername] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const [accType, setAccType] = useState('');
  const { getTokenSilently, loading } = useAuth0();
  const tableHeaderColor = accType === 'Normal' ? '#4085CA' : ' #CA3333';
  const buttonColor = accType === 'Normal' ? 'ui blue button' : 'ui red button';
  const buttonContent =
    accType === 'Normal'
      ? 'Book an interview'
      : 'Indicate your preferred timings';

  const splitBookingIntoSeparateDates = booking => {
    const {
      bookingId,
      topic,
      otherAccType,
      otherBookingId,
      timeslots,
      langs,
      isConfirmed
    } = booking;

    const ans = timeslots.map(timeslot => {
      return {
        bookingId,
        topic,
        otherAccType,
        otherBookingId,
        langs,
        date: timeslot.date,
        timings: timeslot.timings,
        isConfirmed
      };
    });
    return ans;
  };

  const splitBookings = bookings => {
    let finalBookings = [];
    bookings.forEach(
      booking =>
        (finalBookings = finalBookings.concat(
          splitBookingIntoSeparateDates(booking)
        ))
    );
    finalBookings.sort((first, second) => {
      const firstDate = new Date(first.date);
      const secondDate = new Date(second.date);
      if (firstDate < secondDate) {
        return -1;
      } else if (firstDate > secondDate) {
        return 1;
      } else {
        return 0;
      }
    });
    return finalBookings;
  };

  useEffect(() => {
    const getBookings = async () => {
      try {
        const token = await getTokenSilently();
        const header = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = (await axios.get(getUpcomingBookings, header)).data;
        setBookings(splitBookings(response.bookings));
      } catch (err) {
        console.log(err);
      }
    };

    if (!loading) {
      getBookings();
      setRefresh(false);
    }
  }, []);

  //getting past interviews (must check for undefined feedback)
  useEffect(() => {
    const callPastInterviews = async () => {
      try {
        const token = await getTokenSilently();
        const header = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = (await axios.get(getPastInterviews, header)).data;
        setPastInterviews(response.pastInterviews);
        return response;
      } catch (err) {
        console.log(err);
      }
    };

    if (!loading) {
      callPastInterviews();
    }
  }, []);

  useEffect(() => {
    const callAccType = async () => {
      try {
        const token = await getTokenSilently();
        const header = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const type = (await axios.get(getAccType, header)).data;
        setAccType(type);
      } catch (err) {
        console.log(err);
      }
    };

    if (!loading) {
      callAccType();
    }
  }, []);

  useEffect(() => {
    const callUsername = async () => {
      try {
        const token = await getTokenSilently();
        const header = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const username = (await axios.get(getUsername, header)).data;
        setUsername(username);
      } catch (err) {
        console.log(err);
      }
    };
    if (!loading) {
      callUsername();
    }
  }, []);

  const button = (
    <>
      <div className='row'>
        <button
          className={buttonColor}
          style={{
            width: '300px',
            height: '50px'
          }}
          onClick={() =>
            history.push({
              pathname: '/booking',
              state: { accType: accType }
            })
          }
        >
          <h3 className='booking-interview'>{buttonContent}</h3>
        </button>
      </div>
    </>
  );

  const header = (
    <div
      className='row'
      style={{
        marginTop: '2em',
        backgroundColor: `${tableHeaderColor}`,
        height: '5em'
      }}
      ref={headerRef}
    >
      <h2
        style={{
          textAlign: 'center',
          color: 'white',
          paddingTop: '20px',
          fontWeight: 'lighter'
        }}
      >
        Upcoming Interviews
      </h2>
    </div>
  );

  const handleDelete = async (bookingId, date) => {
    try {
      const token = await getTokenSilently();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const data = {
        bookingId,
        date
      };
      await axios.delete(bookingsUrl, { headers, data });
      setBookings(bookings.filter(item => item.bookingId !== bookingId));
      setRefresh(true);
    } catch (err) {
      console.log(err);
    }
  };

  const noUpcomingInterview = (
    <>
      <div
        className='ui fluid container'
        style={{
          backgroundColor: '#F9F9F9',
          minHeight: '35vh',
          maxHeight: '35vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '18px' }}>
            No upcoming interviews <br /> Book an interview now{' '}
          </span>
        </div>
      </div>
    </>
  );

  const haveUpcomingInterview = (
    <>
      <div
        className='ui fluid container'
        style={{
          backgroundColor: '#F9F9F9',
          minHeight: '35vh',
          maxHeight: '35vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <UpcomingInterviewTable
          bookingArray={bookings}
          onDelete={handleDelete}
          username={username}
        />
      </div>
    </>
  );

  const interviewItem = (
    <>
      {bookings.length === 0 && noUpcomingInterview}
      {bookings.length !== 0 && haveUpcomingInterview}
    </>
  );

  const completedInterviewHeader = (
    <div
      className='row'
      style={{
        marginTop: '2em',
        backgroundColor: `${tableHeaderColor}`,
        height: '5em'
      }}
      ref={headerRef}
    >
      <h2
        style={{
          textAlign: 'center',
          color: 'white',
          paddingTop: '20px',
          fontWeight: 'lighter'
        }}
      >
        Completed Interviews
      </h2>
    </div>
  );

  const noCompletedInterviewItem = (
    <>
      <div
        className='ui fluid container'
        style={{
          backgroundColor: '#F9F9F9',
          minHeight: '35vh',
          maxHeight: '35vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div>
          <span style={{ fontSize: '18px' }}>
            No completed interviews <br /> Book an interview now{' '}
          </span>
        </div>
      </div>
    </>
  );

  const haveCompletedInterviewItem = (
    <>
      <div
        className='ui fluid container'
        style={{
          backgroundColor: '#F9F9F9',
          minHeight: '35vh',
          maxHeight: '35vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <CompletedInterviewTable pastInterviewArray={pastInterviews} />
      </div>
    </>
  );

  const completedInterviewItem = (
    <>
      {pastInterviews.length === 0 && noCompletedInterviewItem}
      {pastInterviews.length !== 0 && haveCompletedInterviewItem}
    </>
  );

  if (accType === '') {
    return <LoaderPage />;
  } else {
    return (
      <div className='ui five column grid'>
        <div className='row' style={{ marginTop: '10px' }}>
          <div className='two wide column' />
          <div className='twelve wide column'>
            {button}
            {header}
            {interviewItem}
          </div>
          <div className='two wide column' />
        </div>
        <div className='row' style={{ marginBottom: '10px' }}>
          <div className='two wide column' />
          <div className='twelve wide column'>
            {completedInterviewHeader}
            {completedInterviewItem}
          </div>
          <div className='two wide column' />
        </div>
      </div>
    );
  }
};

export default MainDashboard;
