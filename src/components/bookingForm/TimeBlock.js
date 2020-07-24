import React, { useState, useEffect } from 'react';

const TimeBlock = props => {
  const [click, setClick] = useState(props.selected);
  const [timing, setTiming] = useState(
    props.selected
      ? { value: props.value, set: true }
      : { value: props.value, set: false }
  );
  const buttonColor =
    click === false ? 'ui blue basic button' : 'ui blue button';

  const isButtonDisabled = props.isDisabled
    ? 'ui disabled blue basic button'
    : buttonColor;

  const handleButtonClick = value => {
    click === false ? setClick(true) : setClick(false);
    click === false
      ? setTiming({ value: value, set: true })
      : setTiming({ value: value, set: false });
  };

  useEffect(() => {
    props.callbackFromDays(timing);
  }, [timing, click]);

  return (
    <button
      className={isButtonDisabled}
      style={{ width: '8em' }}
      onClick={() => handleButtonClick(props.value)}
    >
      <h5>{props.value}</h5>
    </button>
  );
};

export default TimeBlock;
