import React, { useState } from 'react';

const TimeBlock = (props) => {
    const [click, setClick] = useState("False");
    
    const buttonColor = click === "False" ? "ui medium blue basic button" : "ui blue button"

    // const clickButton = props.disableButton ? "ui medium blue basic disabled button" : buttonColor

    const handleButtonClick = (value) => {
        click === "False" ? setClick("True") : setClick("False")
        props.callbackFromDays(value);
    }
    
    return (
        <button 
            className={buttonColor}
            style={{ width: '8em' }}
            onClick={() => handleButtonClick(props.value)}
        >
            <h5>{props.value}</h5>
        </button>
    );
}

export default TimeBlock;