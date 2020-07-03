import React, { useState, useEffect } from 'react';

const Rating = props => {
    const ratingNum = [1,2,3,4,5,6,7,8,9,10];
    const [rate, setRate] = useState(0);

    const onChangeHandler = (event) => {
        setRate(event.target.value);
        props.onRateChange({rate: event.target.value, type: props.group });
    }

    return (
        <div className="ui twelve column center aligned grid">
                <div className="three wide column">
                <span style={{ fontSize: '13px'}}>{props.leftExtreme}</span>
                </div>
                {ratingNum.map(num => {
                    return(
                        <div className="one wide column" key={num}>
                            <label htmlFor={num}> {num} <br />
                                <input type="radio" name={props.group} value={num} checked={rate == num} onChange={(e) => onChangeHandler(e)}/>
                            </label>
                        </div>
                    );
                })}
                <div className="three wide column">
                    <span style={{ fontSize: '13px'}}>{props.rightExtreme}</span>
                </div>
        </div>
    );
}

export default Rating;