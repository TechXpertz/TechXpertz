import React, { useState, useEffect, useCallback } from 'react';
import DaysColumn from './DaysColumn';

const AppointmentScheduler = ({ moment, userTiming }) => {
    const [click, setClick] = useState(0);
    const [period, setPeriod] = useState(
        [
            { date: '', timings: [] }
        ]
    )
    let shiftArr = [0, 1, 2, 3, 4, 5, 6];

    const dateHandler = useCallback((childProp) => {
        setPeriod(prevState => {
            return [...prevState.filter((value) => {
                return value.date !== childProp.date
            }),
            prevState[prevState.findIndex((item) => {
                return item.date === childProp.date;
            })] = childProp
            ]
        })
    }, []);

    useEffect(() => {
        userTiming(period.filter((timings) => {
            return timings.date !== ''
        }))
    }, [period])

    const renderDays = (arr) => {
        const newArr = arr.map((i) => {
            if (i + click < 0) {
                setClick(0);
                return i;
            }
            return i + click;
        })
        return newArr.map(index => {
            return (
                <DaysColumn
                    key={(index)}
                    dateObj={moment.clone().add(index, 'days')}
                    onDaysChange={dateHandler}
                    disable={true}
                />
            );
        })
    }

    return (
        <div className="ui ten column grid" style={{ width: "180%", paddingRight: '5px' }}>
            <div
                className="one wide right aligned column"
                style={{ marginLeft: '1em', marginTop: '6px', paddingRight: 'px', paddingLeft: '0px' }}
            >
                <i
                    className="large angle left icon"
                    onClick={() => setClick(click - 7)}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            {renderDays(shiftArr)}
            <div
                className="one wide left aligned column"
                style={{ marginTop: '6px', paddingRight: '0px', paddingLeft: '0px' }}
            >
                <i
                    className="large angle right icon"
                    onClick={() => setClick(click + 7)}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

export default AppointmentScheduler;