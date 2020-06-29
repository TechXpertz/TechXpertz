import React from 'react';

const CommentItem = ({ time, comment }) => {
    return (
        <div className="content">
            <div className="date">
                {time}
            </div>
            <div className="text">
                {comment}
            </div>
        </div>
    )
}

export default CommentItem;