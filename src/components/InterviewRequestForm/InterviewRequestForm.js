import React, { useState } from 'react';
import NavBar from './NavBar';
import DropdownMenu from '../DropdownMenu';
import AppointmentScheduler from '../bookingForm/AppointmentScheduler';
import moment from 'moment/moment.js';
import Axios from 'axios';

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
        // console.log('interestArr', interestArray);

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
                    <input type="checkbox" />
                    <label>Normal</label>
                </div>
            </div>
            <div className="row" style={{ width: '10px', paddingTop: '5px' }}>
                <div className="ui checkbox">
                    <input type="checkbox" />
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
            <button className="ui button">Cancel</button>
            <button className="ui primary button">Submit</button>
        </>
    )

    const userTimingHandler = (value) => {
        console.log(value);
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