import React, { useState } from 'react';
import Header from './Header';
import SubHeader from './SubHeader';
import QuestionBox from './QuestionBox';
import CommentSection from './CommentSection';
import CodeEditor from './CodeEditor';
//import querySearch from 'stringquery';

const InterviewRoom = props => {
  //check if the user booking id is < than the other person booking id
  //if it is lesser than they are assigned 'interviewee' role
  // if not they are assigned 'interviewer' role
  const [userRole, setUserRole] = useState(
    props.location.state.bookingId < props.location.state.otherBookingId ? 'interviewee' : 'interviewer'
  );
  console.log(props.location.state.bookingId);
  console.log(props.location.state.otherBookingId);

  if (userRole === 'interviewee') {
    return (
      <div>
        <Header
          otherBookingId={props.location.state.otherBookingId}
          bookingId={props.location.state.bookingId}
          date={props.location.state.date}
          time={props.location.state.time}
        />
        <SubHeader />
        <div className='ui two column grid'>
          <div className='six wide column'>
            <div className='row' style={{ height: '40vh' }}>
              <QuestionBox
                bookingId={props.location.state.bookingId}
                role={userRole}
              />
            </div>
            <div className='row' style={{ height: '40vh' }}>
              <div className='ui container'>
                <CommentSection
                  bookingId={props.location.state.bookingId}
                />
              </div>
            </div>
          </div>
          <div className='ten wide column'>
            <CodeEditor bookingId={props.location.state.bookingId} />
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'interviewer') {
    return (
      <div>
        <Header
          otherBookingId={props.location.state.otherBookingId}
          bookingId={props.location.state.bookingId}
          date={props.location.state.date}
          time={props.location.state.time}
        />
        <SubHeader />
        <div className='ui two column grid'>
          <div className='six wide column'>
            <div className='row' style={{ height: '40vh' }}>
              <QuestionBox
                bookingId={props.location.state.bookingId}
                role={userRole}
              />
            </div>
            <div className='row' style={{ height: '40vh' }}>
              <div className='ui container'>
                <CommentSection
                  bookingId={props.location.state.bookingId}
                />
              </div>
            </div>
          </div>
          <div className='ten wide column'>
            <CodeEditor bookingId={props.location.state.bookingId} />
          </div>
        </div>
      </div>
    );
  }
};

export default InterviewRoom;
