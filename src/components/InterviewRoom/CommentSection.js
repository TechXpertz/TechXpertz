import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAuth0 } from '../../react-auth0-spa';
import io from "socket.io-client";

const CommentSection = (props) => {

    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
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

    const handleComment = () => {

        socket.emit('comment', newComment);
        setComments(comments.concat(newComment));

    }

    //current time
    //to display when the "interviewer" makes a comment
    const currentTime = moment().format('LT');
    console.log(comments);
    return (
        <>
            <h2>Comment Section</h2>
            {comments.map(comment => <p>{comment}</p>)}
            <input
                placeholder='comment'
                onChange={(event) => setNewComment(event.target.value)}
            />
            <button onClick={() => handleComment()}>Send</button>
        </>
    );
}

export default CommentSection;