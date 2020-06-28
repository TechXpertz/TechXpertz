import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "../../react-auth0-spa";
import LoaderPage from '../LoaderPage';


const QuestionBox = (props) => {

    const [question, setQuestion] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { getTokenSilently, loading } = useAuth0();

    useEffect(() => {

        const getQuestion = async () => {
            const token = await getTokenSilently();
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const data = {
                bookingId: props.bookingId
            }
            const response = await axios.get(
                'http://localhost:5000/questions',
                {
                    params: {
                        bookingId: props.bookingId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data.question;
        }

        if (!loading) {
            getQuestion().then(function (qn) {
                setQuestion(qn);
                setIsLoading(false);
                console.log(qn);
            });
        }

    }, [loading]);

    return (
        <>
            <div className="ui top attached tabular menu" style={{ backgroundColor: "#eeeded" }}>
                <div className="active item">Question</div>
            </div>
            <div className="ui bottom attached active tab segment" style={{ height: '35vh', overflow: 'scroll' }}>
                <span>{question && question.content}</span>
            </div>
        </>
    );
}

export default QuestionBox;