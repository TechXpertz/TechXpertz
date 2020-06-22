import React from 'react';
import NavBar from './NavBar';
import DropdownMenu from '../DropdownMenu';
import AppointmentScheduler from '../bookingForm/AppointmentScheduler';
import moment from 'moment/moment.js';

const InterviewRequestFrom = () => {

    //const daysArr = [1,2,3,4,5,6,7];
    const currentMoment = moment();

    const interestArray = [
        { value: 'DSA', label: 'Data Structure and Algorithm'},
        { value: 'BE', label: 'Backend'},
        { value: 'FE', label: 'Frontend'},
        { value: 'SD', label: 'System Design'},
        { value: 'ADS', label: 'Applied Data Science'}
    ]

    const progLangArray = [
        { value: 'javascript', label: 'Javascript' },
        { value: 'java', label: 'Java' },
        { value: 'ruby', label: 'Ruby' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' }
    ]

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
            />
        </div>
        </>
    )

    const actions =(
        <>
        <button className="ui button">Cancel</button>
        <button className="ui primary button">Submit</button>
        </>
    )

    return (
        <div>
            <NavBar />
            <div className="row" style={{ height: '3em'}}/>
            <div className="ui two column grid" style={{ marginTop: "2em", marginLeft: "20px", width: '100vw'}}>
                <div className="four wide column">
                    <div className="row" style={{ height: '16em'}} />
                    <div className="ui three column grid">
                        <div className="one wide column" />
                        <div className="seven wide column">
                            {accountHeader}
                        </div>
                        <div className="six wide column" style={{ marginTop: '4px', paddingRight: '8px' }}>
                            {accountCheckbox}
                        </div>
                    </div>
                    <div className="row" style={{ paddingTop: "2em"}}>
                        <div className="ui two column grid">
                            <div className="one wide column" />
                            <div className="twelve wide column">
                            {topics}
                            </div>
                        </div>
                    </div>
                    <div className="row" style= {{paddingTop: "2em"}} >
                        <div className="ui two column grid">
                            <div className="one wide column" />
                            <div className="twelve wide column">
                                {progLang}
                            </div>
                        </div>
                    </div>
                    <div className="row" style= {{ paddingTop: "4em"}}>
                        <div className="ui two column grid">
                            <div className="three wide column" />
                            <div className="ten wide column">
                                {actions}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="twelve wide column" style={{ height: '95vh', borderLeft: '1px solid' }}>
                    <div className="row"  style={{ height: '9em'}}/>
                    <AppointmentScheduler 
                        moment={currentMoment}
                    />
                </div>
            </div>
        </div>
        
    );
}

export default InterviewRequestFrom;