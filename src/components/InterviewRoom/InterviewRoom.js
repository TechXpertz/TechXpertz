import React from 'react';
import Header from './Header';
import SubHeader from './SubHeader';
import QuestionBox from './QuestionBox';
import CommentSection from './CommentSection';
import CodeEditor from './CodeEditor';
//import querySearch from 'stringquery';

const InterviewRoom = (props) => {
    console.log(props.location);
    return (
        <div>
            <Header />
            <SubHeader />
            <div className="ui two column grid">
                <div className="six wide column">
                    <div className="row" style={{ height: '40vh' }}>
                        <QuestionBox bookingId={props.location.state.bookingId} />
                    </div>
                    <div className="row" style={{ height: '40vh' }}>
                        <CommentSection
                            bookingId={props.location.state.bookingId}
                        />
                    </div>
                </div>
                <div className="ten wide column">
                    <CodeEditor
                        bookingId={props.location.state.bookingId}
                    />
                </div>
            </div>
        </div>
    );
}

export default InterviewRoom;