import React, { useState, useEffect, useCallback } from 'react';
import TimeBlock from './TimeBlock';

const DaysColumn = props => {
  const timeArr = [
    '7:00AM',
    '9:00AM',
    '11:00AM',
    '1:00PM',
    '3:00PM',
    '5:00PM',
    '7:00PM',
    '9:00PM',
    '11:00PM'
  ];
  const [timings, setTimings] = useState({
    date: props.dateObj.format('DD/MM/YYYY'),
    timeSlots: []
  });

  const callbackForTime = useCallback(timeValues => {
    setTimings(prevState => {
      if (timeValues.set) {
        return {
          date: props.dateObj.format('DD/MM/YYYY'),
          timeSlots: [...prevState.timeSlots, timeValues.value]
        };
      } else {
        return {
          date: props.dateObj.format('DD/MM/YYYY'),
          timeSlots: prevState.timeSlots.filter(
            time => time !== timeValues.value
          )
        };
      }
    });
  }, []);

  useEffect(() => {
    props.onDaysChange(timings);
  }, [timings]);

  return (
    <div className='one wide column' style={{ paddingLeft: '2px' }}>
      <div className='row'>
        <h3
          className='ui center aligned header'
          style={{ marginRight: '18px' }}
        >
          {props.dateObj.format('ddd')}
        </h3>
      </div>
      <div className='row'>
        <h3
          className='ui center aligned grey header'
          style={{ fontWeight: 'lighter', marginRight: '18px' }}
        >
          {props.dateObj.format('MMM')}
          &nbsp;
          {props.dateObj.format('Do')}
        </h3>
      </div>
      {timeArr.map((time, index) => {
        const result =
          props.slotsSelected[0].timeSlots &&
          props.slotsSelected[0].timeSlots.filter(x => x === time);
        return (
          <div className='row' key={index} style={{ marginTop: '1em' }}>
            <TimeBlock
              value={time}
              callbackFromDays={callbackForTime}
              disableButton={props.disableButton}
              selected={result.length === 1}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DaysColumn;
