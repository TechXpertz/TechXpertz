import React, { useState } from 'react';
import TimeBlock from './TimeBlock';

const DaysColumn = ({ day, month, date }) => {
    const timeArr = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM", "11:00 PM", "1:00 AM"];
    const[timings, setTimings] = useState([]);

    const callbackForTime = (timeValues) => {
        setTimings(timeValues);
    }

    console.log(timings);

    return (
        <div className="one wide column"  style={{ paddingLeft:"2px" }}>
            <div className="row">
                <h3 className="ui center aligned header" style={{ marginRight: '18px' }}>
                    {day}
                </h3>
            </div>
            <div className="row">
                <h3 className="ui center aligned grey header" style={{ fontWeight: 'lighter', marginRight: '18px'}}>
                    {month}
                    &nbsp;
                    {date}
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