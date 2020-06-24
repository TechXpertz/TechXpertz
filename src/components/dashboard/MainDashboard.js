import React, { useState, useRef, useEffect } from 'react';
import UpcomingInterviewItem from './UpcomingInterviewItem';
import history from '../../history';
import './Dashboard.css';

const MainDashboard = () => {
    const headerRef = useRef(null);
    const [headerWidth, setHeaderWidth] = useState(0);

    const button = (
        <>
        <div className='row'>
            <button className="ui blue button" style={{ width: '250px', height: '50px'}} onClick={() => history.push('/booking')}>
                <h3 className="booking-interview">
                    Book an interview
                </h3>
            </button>
        </div>
        </>
    )

    const header = (
        <div className="row" style={{ marginTop: '2em', backgroundColor: '#4085CA', height: '5em' }} ref={headerRef} >
            <h2 style={{ textAlign: 'center', color: 'white', paddingTop:'20px', fontWeight: 'lighter'}}>Upcoming Interviews</h2>
        </div>
    )

    useEffect(() => {
        const width = headerRef.current.offsetWidth;
        setHeaderWidth(width);
    }, [headerRef, headerWidth]);

    const upcomingInterviews = (
        <>
        <div className="row" style={{ backgroundColor: '#E1E1E1', paddingTop: '15px', paddingBottom: '15px'}}>
            <div className="ui five column grid">
                <div className="two wide column" style={{ marginLeft: '2.5em', marginRight: '1.5em'}}>
                    <h3 style={{ fontWeight: 'lighter'}}>Date</h3>
                </div>
                <div className="three wide column" style={{ marginRight: '4em'}}>
                    <h3 style={{ fontWeight: 'lighter'}}>Type</h3>
                </div>
                <div className="three wide column" style={{ marginRight: '8px'}}>
                    <h3 style={{ fontWeight: 'lighter'}}>Language</h3>
                </div>
                <div className="three wide column">
                    <h3 style={{ fontWeight: 'lighter'}}>Timing</h3>
                </div>
            </div>
        </div>
        </>
    )

    const interviewItem = (
        <>
        <div className="ui container" style={{backgroundColor: '#F9F9F9', paddingTop: '20px', paddingBottom: '20px', minWidth: `${headerWidth}px`}}>
            <UpcomingInterviewItem
                date="Thu, 21 May 2020"
                type="Data Structure and Algorithm"
                language="C++ or Java"
                timing="2:00 PM, 4:00 PM, 6:00 PM"    
            />
            <UpcomingInterviewItem
                date="Thu, 21 May 2020"
                type="Frontend"
                language="Javascript and Ruby"
                timing="2:00 PM, 4:00 PM, 6:00 PM"    
            />
            <UpcomingInterviewItem
                date="Thu, 21 May 2020"
                type="Backend"
                language="Java and Ruby"
                timing="5:00 PM, 7:00 PM, 11:00 PM"  
            />
        </div>
        </>
    )

    return (
        <div className="ui five column grid">
            <div className="row" style={{ position: 'relative', top: '8em'}}>
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