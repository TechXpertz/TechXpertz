import React, { useState } from 'react';
import NavBar from './NavBar';
import DropdownMenu from '../DropdownMenu';
import AppointmentScheduler from '../bookingForm/AppointmentScheduler';
import moment from 'moment/moment.js';
import Axios from 'axios';
import history from '../../history';
import { useAuth0 } from "../../react-auth0-spa";
import { bookingsUrl } from '../../api_callers/apis.json';

const InterviewRequestFrom = () => {

    //const daysArr = [1,2,3,4,5,6,7];
    const currentMoment = moment();
    const interestArray = [];
    const progLangArray = [];

    React.useEffect(() => {

        const fetchTopics = async () => {
            const response = await Axios.get('http://localhost:5000/info/topics');
            return response.data;
        }

        fetchTopics().then(data => {
            const topics = data.topics
                .map(element => element.topicName);
            topics.forEach(topic => interestArray.push({ value: topic, label: topic }));
        });

        const fetchProgLanguages = async () => {
            const response = await Axios.get('http://localhost:5000/info/prog-languages');
            return response.data;
        }

        fetchProgLanguages().then(data => {
            const progLanguages = data.progLanguages
                .map(element => element.progName)
            progLanguages.forEach(prog => progLangArray.push({ value: prog, label: prog }));
        });
        // console.log('progArr', progLangArray);

    }, [interestArray, progLangArray]);

    const [topicsState, setTopicsState] = useState([]);
    const [lang, setLang] = useState([]);
    const [userTiming, setUserTiming] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const [otherAccType, setOtherAccType] = useState('');

    const submitButton = topicsState.length === 0 || lang.length === 0 || otherAccType === '' || userTiming.length === 0 ? "ui primary disabled button" : "ui primary button"

    const topicHandler = (keyPair) => {
        setTopicsState(keyPair);
    }

    const langHandler = (keyPair) => {
        setLang(keyPair);
    }

    const accountHeader = (
        <>
            <h3>Who do you want to practice with?</h3>
        </>
    )

    const accountCheckbox = (
        <>
            <div className="row" style={{ width: '10px' }}>
                <div className="ui checkbox">
                    <input
                        type="checkbox"
                        onClick={() => (otherAccType ? setOtherAccType('') : setOtherAccType('Normal'))}
                        disabled={otherAccType && otherAccType !== 'Normal' ? "disabled" : null}
                    />
                    <label>Normal</label>
                </div>
            </div>
            <div className="row" style={{ width: '10px', paddingTop: '5px' }}>
                <div className="ui checkbox">
                    <input
                        type="checkbox"
                        onClick={() => (otherAccType ? setOtherAccType('') : setOtherAccType('Expert'))}
                        disabled={otherAccType && otherAccType !== 'Expert' ? "disabled" : null}
                    />
                    <label>Expert</label>
                </div>
            </div>
        </>
    )

    const topics = (
        <>
            <div className="row">
                <h3>Topic</h3>
            </div>
            <div className="row" style={{ paddingTop: '6px' }}>
                <DropdownMenu
                    array={interestArray}
                    content="Please select one topic"
                    valueChanged={topicHandler}
                />
            </div>
        </>
    )

    const progLang = (
        <>
            <div className="row">
                <h3>Programming Languages</h3>
            </div>
            <div className="row" style={{ paddingTop: '6px' }}>
                <DropdownMenu
                    array={progLangArray}
                    content="Choose your programming languages"
                    multi={true}
                    valueChanged={langHandler}
                />
            </div>
        </>
    )

    const actions = (
        <>
            <button className="ui button" onClick={() => history.push('/dashboard')}>Cancel</button>
            <button className={submitButton}
                onClick={() => handleClick(true)}>
                Submit
            </button>
        </>
    )

    const userTimingHandler = (value) => {
        setUserTiming(value);
        console.log(value);
    }

    const handleClick = (value) => {
        setIsSubmit(value);
        submitBookingForm(otherAccType, topicsState, lang, userTiming);
        history.push('/dashboard');
    }

    const { getTokenSilently } = useAuth0();
    const submitBookingForm = async (otherAccType, topic, progLanguages, timeslots) => {
        try {

            const token = await getTokenSilently();
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const myProgLangs = progLanguages.map(prog => {
                return { progName: prog.value };
            });

            const myTimeslots = timeslots.map(slot => {
                return { date: slot.date, timings: slot.timeSlots };
            });

            const data = {
                otherAccType,
                topic: topic.value,
                progLanguages: myProgLangs,
                timeslots: myTimeslots
            };

            console.log(data);

            await Axios.post(bookingsUrl, data, header);


        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="row" style={{ height: '3em' }} />
            <div className="ui two column grid" style={{ marginTop: "2em", marginLeft: "20px", width: '100vw' }}>
                <div className="four wide column">
                    <div className="row" style={{ height: '16em' }} />
                    <div className="ui three column grid">
                        <div className="one wide column" />
                        <div className="seven wide column">
                            {accountHeader}
                        </div>
                        <div className="six wide column" style={{ marginTop: '4px', paddingRight: '8px' }}>
                            {accountCheckbox}
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: "2em" }}>
                        <div className="ui two column grid">
                            <div className="one wide column" />
                            <div className="twelve wide column">
                                {topics}
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: "2em" }} >
                        <div className="ui two column grid">
                            <div className="one wide column" />
                            <div className="twelve wide column">
                                {progLang}
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: "4em" }}>
                        <div className="ui two column grid">
                            <div className="three wide column" />
                            <div className="ten wide column">
                                {actions}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="twelve wide column" style={{ height: '95vh', borderLeft: '1px solid' }}>
                    <div className="row" style={{ height: '9em' }} />
                    <AppointmentScheduler
                        moment={currentMoment}
                        userTiming={userTimingHandler}
                    />
                </div>
            </div>
        </div>

    );
}

export default InterviewRequestFrom;