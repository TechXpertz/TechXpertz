import React from 'react';

const InputBox = props => {
    const handleInput = event => {
        props.valueChanged(event.target.value);
    };

    return (
        <>
            <div className='four wide column'>
                <h3 style={{ marginTop: '5.5px' }}>{props.description}</h3>
            </div>
            <div className='eight wide column'>
                <div className='ui input' style={{ width: '443px' }}>
                    <input
                        type='text'
                        placefold={props.placeholder}
                        onChange={handleInput}
                    />
                </div>
            </div>
        </>
    );
};

export default InputBox;
