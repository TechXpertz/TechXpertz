import React, { useEffect, useState } from 'react';
import Header from './Header';
import SubHeader from './SubHeader';
import QuestionBox from './QuestionBox';
import CommentSection from './CommentSection';
import CodeEditor from './CodeEditor';
import VideoComponent from './VideoComponent';
import axios from 'axios';
import { useAuth0 } from '../../react-auth0-spa';
import { getOrInsertQuestion } from '../../api_callers/apis.json';
import io from 'socket.io-client';

const InterviewRoom = props => {
  //check if the user booking id is < than the other person booking id
  //if it is lesser than they are assigned 'interviewee' role
  // if not they are assigned 'interviewer' role
  const [userRole, setUserRole] = useState(
    props.location.state.bookingId < props.location.state.otherBookingId
      ? 'interviewee'
      : 'interviewer'
  );
  const [switchedRole, setSwitchedRole] = useState(false);
  const [question, setQuestion] = useState();
  const [socket, setSocket] = useState();

  //handlers
  const onChangeRoleHandler = childProp => {
    setUserRole(childProp);
    setSwitchedRole(true);
    socket.emit('switch');
  };

  const { getTokenSilently, loading } = useAuth0();

  const getQuestion = async (token) => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await axios.post(
      getOrInsertQuestion,
      { bookingId: props.location.state.bookingId },
      header
    );
    return response.data.question;
  };

  useEffect(() => {

    if (!loading) {
      getTokenSilently().then(token => {
        const endpoint = '/question';
        const socket = io.connect(endpoint, {
          query: {
            bookingId: props.location.state.bookingId
          },
          transportOptions: {
            polling: {
              extraHeaders: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        });

        setSocket(socket);

        socket.on('message', msg => {
          console.log(msg);
        });

        socket.on('receive question', qn => {
          console.log('receive question', qn);
          setQuestion(qn);
          console.log(question);
        });

        socket.on('receive switch', () => {
          console.log('other user switched roles');
          setUserRole(userRole === 'interviewee' ? 'interviewer' : 'interviewee');
          setSwitchedRole(true);
        });

        if (userRole === 'interviewee') {
          getQuestion(token).then(function (qn) {
            setQuestion(qn);
            console.log(qn);
            socket.emit('question', qn);

            socket.on('receive get question', () => {
              socket.emit('question', qn);
            });

          });
        }

        if (userRole === 'interviewer' && !question) {
          socket.emit('get question');
        }
      });
    }
  }, [loading, userRole]);

  const questionBox = <QuestionBox
    bookingId={props.location.state.bookingId}
    role={userRole}
    question={question}
  />;

  if (userRole === 'interviewee') {
    return (
      <div>
        <Header
          otherBookingId={props.location.state.otherBookingId}
          bookingId={props.location.state.bookingId}
          date={props.location.state.date}
          time={props.location.state.time}
        />
        <SubHeader
          role='interviewee'
          otherRole='Interviewee'
          onClick={onChangeRoleHandler}
          hasSwitched={switchedRole}
        />
        <div className='ui two column grid'>
          <div className='five wide column'>
            <div className='row' style={{ height: '40vh' }}>
              {question && questionBox}
            </div>
            <div className='row' style={{ height: '40vh' }}>
              <div className='ui container'>
                <CommentSection
                  bookingId={props.location.state.bookingId}
                  role='Interviewee'
                />
              </div>
            </div>
          </div>
          <div className='eleven wide column'>
            <CodeEditor bookingId={props.location.state.bookingId} />
            <VideoComponent
              bookingId={props.location.state.bookingId}
              otherBookingId={props.location.state.otherBookingId}
            />
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
        <SubHeader
          role='interviewer'
          onClick={onChangeRoleHandler}
          hasSwitched={switchedRole}
        />
        <div className='ui two column grid'>
          <div className='five wide column'>
            <div className='row' style={{ height: '40vh' }}>
              {question && questionBox}
            </div>
            <div className='row' style={{ height: '40vh' }}>
              <div className='ui container'>
                <CommentSection
                  bookingId={props.location.state.bookingId}
                  role='Interviewer'
                />
              </div>
            </div>
          </div>
          <div className='eleven wide column'>
            <CodeEditor
              bookingId={props.location.state.bookingId}
              role={userRole}
            />
            <VideoComponent
              bookingId={props.location.state.bookingId}
              otherBookingId={props.location.state.otherBookingId}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default InterviewRoom;
