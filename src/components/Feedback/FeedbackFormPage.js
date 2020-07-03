import React, { useState, useCallback } from 'react';
import FeedbackHeader from './FeedbackHeader';
import UserInput from './UserInput';
import Question from './Question';
import Rating from './Rating';
import history from '../../history';

const FeedbackFormPage = (props) => {
    console.log(props.location.state.otherBookingId)
    const firstQuestion = "On a scale of 1 to 10, 1 being completely wrong and 10 being exactly the sample solution, how correct is their solution as compared to the sample solution?";
    const secondQuestion = "On a scale of 1 to 10, 1 being cannot understand their explanation at all and 10 being very clear, how would you rate the the clarity of their explanation?";
    const thirdQuestion = "On a scale of 1 to 10, with 1 being not confident at all and 10 being very confident, how confident was your interviewee?";
    const correctness = [
        "What are some of their lapses in theory in their explanation?",
        "What parts of their program or explanation are incorrect?",
        "Are there any edge cases that they failed to consider?",
        "You may comment down below:"
    ];
    const clarity = [
        "What are some areas that they can improve to make their explanation clearer?",
        "You may comment down below:"
    ];
    const behavioural = [
        "Any other comments about behaviour:"
    ];
    const others = [
        "Any other comments:"
    ];
    const [rate, setRate] = useState({
        correctnessRate: 0,
        clarityRate: 0,
        behaviouralRate: 0
    });
    const [response, setResponse] = useState({
        correctnessFeedback: '',
        clarityFeedback: '',
        behaviouralFeedback: '',
        others: ''
    });

    const rateResult = rate.correctnessRate !== 0 && rate.clarityRate !== 0 && rate.behaviouralRate !== 0;

    const responseResult = response.correctnessFeedback !== '' && response.clarityFeedback !== '' 
    && response.behaviouralFeedback !== '' && response.others !== '';
    console.log(rateResult);
    console.log('response', responseResult);

    const submitButton = rateResult && responseResult ? "ui primary button" : "ui primary disabled button"

    const submitFeedback = () => {
        history.push({
            pathname: '/dashboard',
            state: { otherBookingId: props.location.state.otherBookingId }
        });
    }

    const actions = (
        <>
            <div className="ui right aligned grid">
                <div className="sixteen wide column">
                    <div className={submitButton} style={{ marginBottom: '20px'}} onClick={submitFeedback}>
                        Submit
                    </div>
                </div>
            </div>
        </>
    )

    const ratingHandler = useCallback((childProp) => {
        switch(childProp.type){
            case 'FIRST':
                return setRate(prevState => {
                    return {...prevState, correctnessRate: childProp.rate};
                });
            case 'SECOND':
                return setRate(prevState => {
                    return {...prevState, clarityRate: childProp.rate};
                });
            case 'THIRD':
                return setRate(prevState => {
                    return {...prevState, behaviouralRate: childProp.rate};
                });
            default:
                return console.log('Should not come here!');
        }
    }, [])

    const commentHandler = useCallback((childProp) => {
        switch(childProp.type){
            case 'FIRST':
                return setResponse(prevState => {
                    return {...prevState, correctnessFeedback: childProp.comment};
                });

            case 'SECOND':
                return setResponse((prevState) => {
                    return {...prevState, clarityFeedback: childProp.comment};
                });
            case 'THIRD':
                return setResponse((prevState) => {
                    return {...prevState, behaviouralFeedback: childProp.comment};
                });
            
            case 'OTHER':
                return setResponse((prevState) => {
                    return {...prevState, others: childProp.comment};
                });
            default: 
                return console.log('Should not come here!')
        }
    }, []);

    return (
        <div>
            <FeedbackHeader />
                <div className="ui grid" style={{ marginTop: '7px', marginLeft: '10px'}}>
                    <div className="row">
                        <div className="one wide column" />
                        <div className="four wide column">
                            <span style={{ fontSize: '20px'}}>Tell your interviewee how he/she did</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            <Question 
                                header="Correctness of explanation and program" 
                                question={firstQuestion} 
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className= "four wide column" />
                        <div className="eight wide column" style={{ alignItems: 'center' }}>
                            <Rating 
                                leftExtreme="Completely wrong" 
                                rightExtreme="Same as the sample solution"  
                                group="FIRST"
                                onRateChange={ratingHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            <UserInput 
                                array={correctness} 
                                group="FIRST" 
                                userCommentHandler={commentHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                           <Question 
                                header="Clarity of explanation" 
                                question={secondQuestion}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className= "four wide column" />
                        <div className="eight wide column" style={{ alignItems: 'center' }}>
                            <Rating 
                                leftExtreme="Cannot understand explanation" 
                                rightExtreme= "Very clear explanation" 
                                group="SECOND" 
                                onRateChange={ratingHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            <UserInput 
                                array={clarity} 
                                group="SECOND"
                                userCommentHandler={commentHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                           <Question 
                                header="Behavioural" 
                                question={thirdQuestion}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className= "four wide column" />
                        <div className="eight wide column" style={{ alignItems: 'center' }}>
                            <Rating 
                                leftExtreme="Not confident at all" 
                                rightExtreme= "Very confident" 
                                group="THIRD" 
                                onRateChange={ratingHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            <UserInput 
                                array={behavioural} 
                                group="THIRD"
                                userCommentHandler={commentHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                           <Question 
                            header="Others" 
                        />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            <UserInput 
                                array={others} 
                                group="OTHER"
                                userCommentHandler={commentHandler}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="four wide column" />
                        <div className="eight wide column">
                            {actions}
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default FeedbackFormPage;