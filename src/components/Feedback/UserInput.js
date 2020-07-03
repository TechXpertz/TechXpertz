import React, { useState } from 'react';

const UserInput = props => {
    const [comment, setComment] = useState('');

    const onCommentHandler = (event) => {
        setComment(event.target.value);
        props.userCommentHandler({comment: event.target.value, type: props.group})
    }

    return (
        <div className="ui grid" style={{ paddingLeft: '15px'}}>
            {props.array.map(item => {
                return(
                    <div className="row" key={Math.random()}style={{ height: '10px'}}>
                        <span>{item}</span>
                    </div>
                );
            })}
            <div className="row">
                <div className="sixteen wide column" style={{ paddingLeft: '0px'}}>
                    <div className="ui form">
                        <div className="field">
                            <textarea onChange={onCommentHandler}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInput;