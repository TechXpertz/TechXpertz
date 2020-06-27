import React from 'react';

const UpcomingInterviewItem = ({ bookingId, date, type, language, timing, onDelete }) => {
    return (
        <div className="ui two column grid">
            <div className="fourteen wide column" style={{ paddingBottom: '0px' }}>
                <div className="ui segment" style={{ width: '1000px', height: '55px', marginLeft: '1.5em', paddingBottom: '18px', backgroundColor: '#DEEBF2' }}>
                    <div className="ui four column grid">
                        <div className="two wide column" style={{ marginRight: '4em', paddingTop: '10px' }}>
                            <p>{date}</p>
                        </div>
                        <div className="four wide column" style={{ marginRight: '3.5em' }}>
                            <p>{type}</p>
                        </div>
                        <div className="four wide column">
                            <p>{language}</p>
                        </div>
                        <div className="four wide column">
                            <p>{timing}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="two wide column">
                <div className="row">
                    <button className="compact ui tiny button" style={{ marginBottom: '5px' }}>
                        Reschedule
                    </button>
                </div>
                <div className="row">
                    <button className="compact ui red tiny button"
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