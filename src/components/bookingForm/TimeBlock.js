import React, { useState } from 'react';

const TimeBlock = ({ value, callbackFromDays }) => {
    const [click, setClick] = useState("False");

    const buttonColor = click === "False" ? "ui medium blue basic button" : "ui blue button"

    const handleButtonClick = (value) => {
        click === "False" ? setClick("True") : setClick("False")
        callbackFromDays(value);
    }

    return (
        <div 
            className={buttonColor}
            style={{ width: '8em' }}
            value
            onClick={(value) => handleButtonClick(value)}
        >
            <h5>{value}</h5>
        </div>
    );
}

export default TimeBlock;