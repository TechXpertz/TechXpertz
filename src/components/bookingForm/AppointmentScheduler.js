import React, { useState, useEffect, useCallback, memo } from 'react';
import DaysColumn from './DaysColumn';

const AppointmentScheduler = ({ moment, userTimingCallback, userTiming }) => {
  const [click, setClick] = useState(0);
  const [period, setPeriod] = useState([{ date: '', timeSlots: [] }]);
  let shiftArr = [0, 1, 2, 3, 4, 5, 6];

  const dateHandler = useCallback(childProp => {
    if (childProp.timeSlots.length <= 0) {
      setPeriod(prevState => {
        return prevState.filter(time => {
          return time.date !== childProp.date;
        });
      });
    } else {
      setPeriod(prevState => {
        return [
          ...prevState.filter(value => {
            return value.date !== childProp.date && value.date !== '';
          }),
          (prevState[
            prevState.findIndex(item => {
              return item.date === childProp.date;
            })
          ] = childProp)
        ];
      });
    }
  }, []);

  useEffect(() => {
    userTimingCallback(
      period.filter(timing => {
        return (
          timing.timeSlots &&
          timing.timeSlots.length > 0 &&
          !timing.timeSlots.includes('"')
        );
      })
    );
  }, [period]);

  const renderDays = arr => {
    const newArr = arr.map(i => {
      if (i + click < 0) {
        setClick(0);
        return i;
      }
      return i + click;
    });
    return newArr.map(index => {
      return (
        <div className='two wide column'>
          <DaysColumn
            key={index}
            dateObj={moment.clone().add(index, 'days')}
            onDaysChange={dateHandler}
            slotsSelected={
              period.filter(
                item =>
                  item.date ===
                  moment
                    .clone()
                    .add(index, 'days')
                    .format('DD/MM/YYYY')
              ).length === 1
                ? period.filter(
                    x =>
                      x.date ===
                      moment
                        .clone()
                        .add(index, 'days')
                        .format('DD/MM/YYYY')
                  )
                : [{ date: '', timeSlots: '' }]
            }
          />
        </div>
      );
    });
  };

  return (
    <div className='ui nine column grid container'>
      <div
        className='one wide right aligned column'
        style={{
          marginTop: '6px'
        }}
      >
        <i
          className='large angle left icon'
          onClick={() => setClick(click - 7)}
          style={{ cursor: 'pointer' }}
        />
      </div>
      {renderDays(shiftArr)}
      <div
        className='one wide left aligned column'
        style={{ marginTop: '6px' }}
      >
        <i
          className='large angle right icon'
          onClick={() => setClick(click + 7)}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default memo(AppointmentScheduler);
