import React from 'react';

const Question = props => {
    return (
        <>
            <h3>{props.header}</h3>
            <span style={{ fontSize: '16px' }}>{props.question}</span>
        </>
    )
}

export default Question;