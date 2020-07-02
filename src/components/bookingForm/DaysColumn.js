import React, { useState, useEffect, useCallback } from 'react';
import TimeBlock from './TimeBlock';

const DaysColumn = (props) => {
    const timeArr = ["7.00 AM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM", "11:00 PM"];
    const [timings, setTimings] = useState({
        date: props.dateObj.format('DD/MM/YYYY'),
        timeSlots: []
    });

    const callbackForTime = useCallback((timeValues) => {
        setTimings(prevState => {
            if(!prevState.timeSlots.includes(timeValues)){
                return {
                    ...prevState,
                    timeSlots: [...prevState.timeSlots, timeValues]
                }
            } else {
                return {
                    ...prevState,
                    timeSlots: prevState.timeSlots.filter(time => time !== timeValues)
                }
            }
        });
    }, []);

    useEffect(() => {
        if (timings.timeSlots.length <= 0) {
            return;
        }
        props.onDaysChange(timings);
    }, [timings])

    return (
        <div className="one wide column" style={{ paddingLeft: "2px" }}>
            <div className="row">
                <h3 className="ui center aligned header" style={{ marginRight: '18px' }}>
                    {props.dateObj.format('ddd')}
                </h3>
            </div>
            <div className="row">
                <h3 className="ui center aligned grey header" style={{ fontWeight: 'lighter', marginRight: '18px' }}>
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