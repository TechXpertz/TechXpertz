import React from 'react';

const InputBox = (props) => {
    return (
        <>
            <div className="four wide column">
                <h3 style={{ marginTop: '5.5px' }}>{props.description}</h3>
            </div>
            <div className="eight wide column">
                <div className="ui input" style={{ width: '443px' }}>
                    <input type="text"
                        placefold={props.placeholder}
                        onChange={props.valueChanged} />
                </div>
            </div>
        </>
    );
}

export default InputBox;