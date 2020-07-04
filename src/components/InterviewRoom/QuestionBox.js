import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "../../react-auth0-spa";
import LoaderPage from '../LoaderPage';
import { getOrInsertQuestion } from '../../api_callers/apis.json';


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
            }
            const response = await axios.post(getOrInsertQuestion,
                { bookingId: props.bookingId },
                header);
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
                <div className="active item">
                    <h3>Question</h3>
                </div>
            </div>
            <div className="ui bottom attached active tab segment" style={{ height: '35vh', overflow: 'scroll' }}>
                <span>{question && question.content}</span>
            </div>
        </>
    );
}

export default QuestionBox;