import React from 'react';
import history from '../../history';
import './InterviewRoom.css';
import { deleteOtherTimeslots } from '../../api_callers/apis.json';
import { useAuth0 } from '../../react-auth0-spa';
import axios from 'axios';

const Header = (props) => {

    const onExit = () => {
        props.onExit();
        removeOtherTimeslots();
        history.push({
            pathname: '/feedback-form-page',
            state: {
                otherBookingId: props.otherBookingId,
                bookingId: props.bookingId
            }
        });
    };

    const { getTokenSilently } = useAuth0();

    const removeOtherTimeslots = async () => {
        try {

            const token = await getTokenSilently();
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                bookingId: props.bookingId,
                date: props.date,
                time: props.time
            };
            console.log(data);
            await axios.delete(deleteOtherTimeslots, { headers, data });

        } catch (err) {
            console.log(err);
        }

    }

    return (
        <div className="header-text">
            <div className="ui right aligned container">
                <h2>Interview Room</h2>
            </div>
            <div className="ui right aligned container" style={{ width: '1000px' }}>
                <button className='compact ui red medium right labeled icon button' style={{ color: 'black' }} onClick={onExit}>
                    Exit Session
                    <i className="window close outline icon" />
                </button>
            </div>
        </div>
    );
};

export default Header;