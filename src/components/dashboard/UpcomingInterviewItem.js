import React from 'react';
import history from '../../history';

const UpcomingInterviewItem = ({ bookingId, date, type, language, timing, onDelete, onReschedule, otherBookingId }) => {

    const joinRoom = () => {
        history.push({
            pathname: '/interview-room',
            state: {
                bookingId: bookingId,
                otherBookingId: otherBookingId
            }
        });
    }

    const joinRoomButton = (

        <button className="compact ui small green button" onClick={joinRoom}>
            Join
        </button>

    )

    return (
        <div className="ui two column grid">
            <div className="fourteen wide column" style={{ paddingBottom: '0px' }}>
                <div className="ui padded segment" style={{ height: '70px', marginLeft: '1.5em', paddingBottom: '14px', paddingTop: '18px', backgroundColor: '#DEEBF2' }}>
                    <div className="ui five column grid">
                        <div className="three wide column" style={{ paddingTop: '15px' }}>
                            <p style={{ fontSize: '16px' }}>{date}</p>
                        </div>
                        <div className="three wide column">
                            <p style={{ fontSize: '16px' }}>{type}</p>
                        </div>
                        <div className="four wide column">
                            <p style={{ fontSize: '16px' }}>{language}</p>
                        </div>
                        <div className="four wide column" style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '16px' }}>{timing}</p>
                        </div>
                        <div className="two wide column">
                            {joinRoomButton}
                        </div>
                    </div>
                </div>
            </div>
            <div className="one wide column" style={{ position: 'relative', marginRight: '2.5em' }}>
                <div className="row">
                    <button
                        className="compact ui tiny button"
                        style={{ marginBottom: '2px', marginTop: '4px' }}
                        onClick={() => onReschedule(bookingId)}
                    >
                        Reschedule
                    </button>
                </div>
                <div className="row">
                    <button
                        className="compact ui red tiny button"
                        onClick={() => onDelete(bookingId)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpcomingInterviewItem;