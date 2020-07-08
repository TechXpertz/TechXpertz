import React, { useState } from 'react';

const TimeBlock = props => {
  const [click, setClick] = useState(props.selected);

  const buttonColor =
    click === false ? 'ui medium blue basic button' : 'ui blue button';

  const handleButtonClick = value => {
    click === false ? setClick(true) : setClick(false);
    props.callbackFromDays(value);
  };

  return (
    <button
      className={buttonColor}
      style={{ width: '8em' }}
      onClick={() => handleButtonClick(props.value)}
    >
      <h5>{props.value}</h5>
    </button>
  );
};

export default TimeBlock;
