import React from 'react';
import Select from 'react-select';

const DropdownMenu = (props) => {

    if(props.multi){
        return (
            <Select 
                options={props.array}
                isMulti
                placeholder={props.content}
                className="basic-multi-select"
                isClearable
                onChange={(value) => props.valueChanged(value)}
            />
        );
    } else {
        return (
            <Select 
                    options={props.array}
                    placeholder={props.content}
                    onChange={(value) => props.valueChanged(value)}
                />
        );
    }
    
}

export default DropdownMenu;