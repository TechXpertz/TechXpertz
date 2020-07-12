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
  reschedule
} from '../../api_callers/apis.json';
import axios from 'axios';
import { useAuth0 } from '../../react-auth0-spa';

const MainDashboard = () => {
  const headerRef = useRef(null);
  const [headerWidth, setHeaderWidth] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const [
    upcomingInterviewItemsGroupedInSameBookingId,
    setUpcomingInterviewItemsGroupedInSameBookingId
  ] = useState([]);

  function debounce(fn, ms) {
    let timer;
    return _ => {
      clearTimeout(timer);
      timer = setTimeout(_ => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  //used to dynamically resize the ui segment for the upcoming interview items
  useEffect(() => {
    const debouncedHandleResize = debounce(function handlResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 20);

    window.addEventListener('resize', debouncedHandleResize);

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  const { getTokenSilently, loading } = useAuth0();

  const splitBookingIntoSeparateDates = booking => {
    const {
      bookingId,
      topic,
      otherAccType,
      otherBookingId,
      timeslots,
      langs
    } = booking;

    const ans = timeslots.map(timeslot => {
      return {
        bookingId,
        topic,
        otherAccType,
        otherBookingId,
        langs,
        date: timeslot.date,
        timings: timeslot.timings
      };
    });
    return ans;
  };

  // const splitBookingsByBookingId = bookings => {
  //   console.log(bookings);
  //   set
  // };

  const splitBookings = bookings => {
    //console.log(bookings);
    let finalBookings = [];
    bookings.forEach(
      booking =>
        (finalBookings = finalBookings.concat(
          splitBookingIntoSeparateDates(booking)
        ))
    );
    //console.log(finalBookings);
    return finalBookings;
  };

  // getting upcoming bookings:
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
        setUpcomingInterviewItemsGroupedInSameBookingId(response.bookings);
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

  const button = (
    <>
      <div className='row'>
        <button
          className='ui blue button'
          style={{ width: '250px', height: '50px' }}
          onClick={() => history.push('/booking')}
        >
          <h3 className='booking-interview'>Book an interview</h3>
        </button>
      </div>
    </>
  );

  const header = (
    <div
      className='row'
      style={{ marginTop: '2em', backgroundColor: '#4085CA', height: '5em' }}
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

  useEffect(() => {
    const width = headerRef.current.offsetWidth;
    setHeaderWidth(width);
  }, [headerRef, headerWidth, dimensions]);

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

  const handleReschedule = async value => {
    try {
      const token = await getTokenSilently();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const data = {
        bookingId: value.bookingId
      };
      await axios.delete(reschedule, { headers, data });
      history.push({
        pathname: '/update-booking',
        state: {
          otherAccType: value.accountTypeSelected,
          topic: value.topicSelected,
          langs: value.langSelected,
          timings: value.timings,
          date: value.dateSelected,
          timingsByBookingId: value.timingsByBookingId
        }
      });
      // go to the booking form
    } catch (err) {
      console.log(err);
    }
  };
  const noUpcomingInterview = (
    <>
      <div
        className='ui container'
        style={{
          backgroundColor: '#F9F9F9',
          minWidth: `${headerWidth}px`,
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
        className='ui container'
        style={{
          backgroundColor: '#F9F9F9',
          minWidth: `${headerWidth}px`,
          minHeight: '35vh',
          maxHeight: '35vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <UpcomingInterviewTable
          bookingArray={bookings}
          bookingsByBookingIdArray={
            upcomingInterviewItemsGroupedInSameBookingId
          }
          onDelete={handleDelete}
          onReschedule={handleReschedule}
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
      style={{ marginTop: '2em', backgroundColor: '#4085CA', height: '5em' }}
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
        className='ui container'
        style={{
          backgroundColor: '#F9F9F9',
          minWidth: `${headerWidth}px`,
          minHeight: '35vh',
          maxHeight: '35vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
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
        className='ui container'
        style={{
          backgroundColor: '#F9F9F9',
          minWidth: `${headerWidth}px`,
          minHeight: '35vh',
          maxHeight: '35vh'
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

  return (
    <div className='ui five column grid'>
      <div className='row' style={{ marginTop: '5em' }}>
        <div className='two wide column' />
        <div className='twelve wide column'>
          {button}
          {header}
          {bookings && interviewItem}
          {!bookings && <LoaderPage />}
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
};

export default MainDashboard;
