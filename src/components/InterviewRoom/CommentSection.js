import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import moment from 'moment';
import { useAuth0 } from '../../react-auth0-spa';
import io from 'socket.io-client';
import './InterviewRoom.css';

const CommentSection = props => {
  const { bookingId, role, otherRole } = props;
  console.log(role);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      commentContent: '',
      commentTime: '',
      commentAuthor: ''
    }
  ]);
  const [socket, setSocket] = useState();
  const { getTokenSilently, loading } = useAuth0();
  const endpoint = '/comments';
  const currentTime = moment().format('LT');
  const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    try {
      if (!loading) {
        getTokenSilently().then(tokenRes => {
          const socket = io.connect(endpoint, {
            query: {
              bookingId
            },
            transportOptions: {
              polling: {
                extraHeaders: {
                  Authorization: `Bearer ${tokenRes}`
                }
              }
            }
          });

          setSocket(socket);

          socket.on('error', error => {
            console.log('error', error);
          });

          socket.on('message', msg => {
            console.log(msg);
          });

          socket.on('receive comment', newComment => {
            console.log('comments', comments);
            setComments(prevState => {
              return [
                ...prevState,
                {
                  commentContent: newComment,
                  commentTime: currentTime,
                  commentAuthor: otherRole
                }
              ];
            });
            console.log(newComment);
          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [loading]);

  const handleComment = event => {
    event.preventDefault();
    socket.emit('comment', {
      bookingId,
      comment: newComment,
      date: currentDate,
      timeStamp: currentTime
    });
    setComments(prevState => {
      return [
        ...prevState,
        {
          commentContent: newComment,
          commentTime: currentTime,
          commentAuthor: role
        }
      ];
    });
    setNewComment('');
  };

  return (
    <>
      <div className='ui comments' style={{ padding: '20px 10px 0px' }}>
        <div className='ui dividing header'>Comment Section</div>
      </div>
      <div
        className='comments'
        style={{
          minHeight: '22vh',
          maxHeight: '22vh',
          overflow: 'auto',
          padding: '0px 10px'
        }}
      >
        {comments.map(item => {
          return (
            <CommentItem
              time={item.commentTime}
              key={Math.random()}
              comment={item.commentContent}
              role={item.commentAuthor}
            />
          );
        })}
      </div>
      <div className='ui container'>
        <form
          className='ui reply form'
          style={{ padding: '20px 18px' }}
          onSubmit={handleComment}
        >
          <div className='field'>
            <textarea
              placeholder='Please type in your comment here'
              value={newComment}
              onChange={event => setNewComment(event.target.value)}
            />
          </div>
          <button
            className='ui primary submit labeled icon button'
            type='submit'
          >
            <i className='icon edit'></i> Add Comment
          </button>
        </form>
      </div>
    </>
  );
};

export default CommentSection;
