import React, { useState, useEffect } from 'react';
import TimeBlock from './TimeBlock';

const DaysColumn = (props) => {
    const timeArr = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM", "11:00 PM", "1:00 AM"];
    const[timings, setTimings] = useState({
        date: props.dateObj.format('MM/DD/YYYY'),
        timeSlots: []
    });

    const callbackForTime = (timeValues) => {
        setTimings(prevState => {
           return  {
            ...prevState, 
            timeSlots: [...prevState.timeSlots, timeValues]}
        });
    }

    useEffect(() => {
        if(timings.timeSlots.length <= 0){
            return;
        }
        props.onDaysChange(timings);
    }, [timings])

    //console.log(timings);

    return (
        <div className="one wide column"  style={{ paddingLeft:"2px" }}>
            <div className="row">
                <h3 className="ui center aligned header" style={{ marginRight: '18px' }}>
                    {props.dateObj.format('ddd')}
                </h3>
            </div>
            <div className="row">
                <h3 className="ui center aligned grey header" style={{ fontWeight: 'lighter', marginRight: '18px'}}>
                    {props.dateObj.format('MMM')}
                    &nbsp;
                    {props.dateObj.format('Do')}
                </h3>
            </div>
            {timeArr.map((time) => {
                return (
                    <div className="row" style={{ marginTop: "1em" }}>
                        <TimeBlock value={time} callbackFromDays={callbackForTime} />
                    </div>
                );
            })}
        </div>
    );
}

export default DaysColumn;