import React, { useState, useEffect } from 'react';

const TimeBlock = props => {
  const [click, setClick] = useState(props.selected);
  const [timing, setTiming] = useState(
    props.selected
      ? { value: props.value, set: true }
      : { value: props.value, set: false }
  );
  const buttonColor =
    click === false
      ? 'fluid tiny ui blue basic button'
      : 'fluid tiny ui blue button';

  const isButtonDisabled = props.isDisabled
    ? 'fluid tiny ui disabled blue basic button'
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
      onClick={() => handleButtonClick(props.value)}
    >
      <h5>{props.value}</h5>
    </button>
  );
};

export default TimeBlock;
