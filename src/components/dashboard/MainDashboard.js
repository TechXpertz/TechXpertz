import React, { useState, useRef, useEffect } from 'react';
import UpcomingInterviewItem from './UpcomingInterviewItem';
import history from '../../history';
import './Dashboard.css';
import { getUpcomingBookings, bookingsUrl } from '../../api_callers/apis.json';
import axios from 'axios';
import { useAuth0 } from "../../react-auth0-spa";

const MainDashboard = () => {
    const headerRef = useRef(null);
    const [headerWidth, setHeaderWidth] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const { getTokenSilently, loading } = useAuth0();

    const splitBookingIntoSeparateDates = (booking) => {

        const { bookingId, topic, otherAccType, otherBookingId, timeslots, langs } = booking;

        const ans = timeslots.map(
            timeslot => {
                return {
                    bookingId,
                    topic,
                    otherAccType,
                    otherBookingId,
                    langs,
                    date: timeslot.date,
                    timings: timeslot.timings
                }
            }
        );
        return ans;
    };

    const splitBookings = (bookings) => {

        let finalBookings = [];
        bookings.forEach(booking =>
            finalBookings = finalBookings.concat(splitBookingIntoSeparateDates(booking)));
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
                setBookings(splitBookings(response.bookings));
                console.log(splitBookings(response.bookings));


            } catch (err) {
                console.log(err);
            }

        };

        if (!loading || refresh) {
            getBookings();
            setRefresh(false);
        }

    }, [refresh]);

    const button = (
        <>
            <div className='row'>
                <button className="ui blue button" style={{ width: '250px', height: '50px' }} onClick={() => history.push('/booking')}>
                    <h3 className="booking-interview">
                        Book an interview
                </h3>
                </button>
            </div>
        </>
    )

    const header = (
        <div className="row" style={{ marginTop: '2em', backgroundColor: '#4085CA', height: '5em' }} ref={headerRef} >
            <h2 style={{ textAlign: 'center', color: 'white', paddingTop: '20px', fontWeight: 'lighter' }}>Upcoming Interviews</h2>
        </div>
    )

    useEffect(() => {
        const width = headerRef.current.offsetWidth;
        setHeaderWidth(width);
    }, [headerRef, headerWidth]);

    const upcomingInterviews = (
        <>
            <div className="row" style={{ backgroundColor: '#E1E1E1', paddingTop: '15px', paddingBottom: '15px' }}>
                <div className="ui five column grid">
                    <div className="two wide column" style={{ marginLeft: '2.5em', marginRight: '1.5em' }}>
                        <h3 style={{ fontWeight: 'lighter' }}>Date</h3>
                    </div>
                    <div className="three wide column" style={{ marginRight: '4em' }}>
                        <h3 style={{ fontWeight: 'lighter' }}>Type</h3>
                    </div>
                    <div className="three wide column" style={{ marginRight: '8px' }}>
                        <h3 style={{ fontWeight: 'lighter' }}>Language</h3>
                    </div>
                    <div className="three wide column">
                        <h3 style={{ fontWeight: 'lighter' }}>Timing</h3>
                    </div>
                </div>
            </div>
        </>
    )

    const timingsToString = timings => {
        return timings.join(', ');
    };

    const langsToString = langs => {
        return langs.join(', ');
    };

    const handleDelete = async (booking) => {

        try {

            const token = await getTokenSilently();
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                bookingId: booking
            };
            await axios.delete(bookingsUrl, { headers, data });
            setBookings(bookings.filter(item => item.bookingId !== booking));
            setRefresh(true);

        } catch (err) {
            console.log(err);
        }
    }

    const interviewItem = (
        <>
            <div className="ui container" style={{ backgroundColor: '#F9F9F9', paddingTop: '20px', paddingBottom: '20px', minWidth: `${headerWidth}px` }}>
                {bookings.map((booking, index) => {
                    const { bookingId, date, otherBookingId, otherAccType, timings, topic, langs } = booking;
                    return (
                        <UpcomingInterviewItem
                            key={index}
                            bookingId={bookingId}
                            date={date}
                            otherBookingId={otherBookingId}
                            otherAccType={otherAccType}
                            timing={otherBookingId !== null ? timings[0] : timingsToString(timings)}
                            type={topic}
                            language={langsToString(langs)}
                            onDelete={handleDelete}
                        />
                    );
                })}
            </div>
        </>
    )

    return (
        <div className="ui five column grid">
            <div className="row" style={{ position: 'relative', top: '8em' }}>
                <div className="two wide column" />
                <div className="twelve wide column" >
                    {button}
                    {header}
                    {upcomingInterviews}
                    {interviewItem}
                </div>
                <div className="two wide column" />
            </div>
        </div>
    );
}

export default MainDashboard;