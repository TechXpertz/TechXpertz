import React from 'react';
import Select from 'react-select';

const DropdownMenu = props => {
  if (props.multi) {
    return (
      <Select
        value={props.defaultValue}
        options={props.array}
        isMulti
        placeholder={props.content}
        className='basic-multi-select'
        isClearable
        onChange={value => props.valueChanged(value)}
        minMenuHeight={200}
        maxMenuHeight={300}
      />
    );
  } else {
    return (
      <Select
        options={props.array}
        placeholder={props.content}
        onChange={value => props.valueChanged(value)}
        defaultValue={props.defaultValue}
      />
    );
  }
};

export default DropdownMenu;
