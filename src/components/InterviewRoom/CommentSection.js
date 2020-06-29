import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import moment from 'moment';
import { useAuth0 } from '../../react-auth0-spa';
import io from "socket.io-client";
import './InterviewRoom.css';

const CommentSection = (props) => {

    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([{
        commentContent: '',
        commentTime: ''
    }]);
    const [socket, setSocket] = useState();

    const { getTokenSilently, loading } = useAuth0();
    const endpoint = "http://localhost:5000/comments";
    const bookingId = props.bookingId;

    useEffect(() => {

        try {

            if (!loading) {
                getTokenSilently().then(tokenRes => {
                    const socket = io.connect(endpoint, {
                        query: {
                            bookingId,
                        },
                        transportOptions: {
                            polling: {
                                extraHeaders: {
                                    'Authorization': `Bearer ${tokenRes}`
                                }
                            }
                        }
                    });

                    setSocket(socket);

                    socket.on('error', error => {
                        console.log('error', error);
                    });

                    socket.on('message', (msg) => {
                        console.log(msg);
                    });

                    socket.on('receive comment', (newComment) => {
                        console.log('comments', comments);
                        setComments(comments.concat(newComment));
                        console.log(newComment);
                    })

                });
            }

        } catch (err) {
            console.log(err);
        }

    }, [loading]);

    const currentTime = moment().format('LT');

    const handleComment = (event) => {
        event.preventDefault();
        socket.emit('comment', newComment);
        setComments(prevState => {
            return [...prevState, {
                commentContent: newComment,
                commentTime: currentTime
            }]
        });
        setNewComment('');
    }

    return (
        <>
        <div className="ui comments" style={{ padding: '20px 18px'}}>
            <div className="ui dividing header">
                Comment Section
            </div>
            <div className="content" style={{ minHeight: '150px', maxHeight: '200px', overflow: 'auto'}}>
                {comments.map(item => {
                    return <CommentItem time={item.commentTime} comment={item.commentContent} />
                })}
            </div>
        </div>
        <form style={{ padding:'20px 18px' }} onSubmit={handleComment}>
            <div className="field">
                <textarea 
                    placeholder="Please type in your comment here" 
                    value={newComment} 
                    style={{ width: `550px`, height: '90px' }} 
                    onChange={(event) => setNewComment(event.target.value)}
                />
            </div>
            <button className="ui primary submit labeled icon button" type="submit">
                <i className="icon edit"></i> Add Comment
            </button>
        </form>
        </>
    );
}

export default CommentSection;