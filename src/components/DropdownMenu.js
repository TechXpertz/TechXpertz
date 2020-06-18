import React, { useState } from 'react';
import Select from 'react-select';

const DropdownMenu = (props) => {
    const [inputValue, setInputValue] = useState([]);
    
    console.log(inputValue);

    if(props.multi){
        return (
            <Select 
                options={props.array}
                isMulti
                placeholder={props.content}
                className="basic-multi-select"
                isClearable
                onChange={(value) => setInputValue(value)}
            />
        );
    } else {
        return (
            <Select 
                    options={props.array}
                    placeholder={props.content}
                    onChange={(value) => setInputValue(value)}
                />
        );
    }
    
}

export default DropdownMenu;