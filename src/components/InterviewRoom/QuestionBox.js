import React from 'react';


const QuestionBox = () => {
    return (
        <>
            <div className="ui top attached tabular menu" style={{ backgroundColor: "#eeeded"}}>
                <div className="active item">Question</div>
            </div>
            <div className="ui bottom attached active tab segment" style={{ height: '35vh', overflow: 'scroll' }}>
                <span>This is where the questions will be positioned for the user to refer to</span>
            </div>
        </>
    );
}

export default QuestionBox;