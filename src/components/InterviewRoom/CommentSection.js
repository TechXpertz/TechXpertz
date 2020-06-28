import React from 'react';
import moment from 'moment';

const CommentSection = () => {

    //current time
    //to display when the "interviewer" makes a comment
    const currentTime = moment().format('LT');

    return (
        <h2>Comment Section</h2>
    );
}

export default CommentSection;