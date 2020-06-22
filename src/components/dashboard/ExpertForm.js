import React, { useState, useEffect } from 'react';
import InputBox from '../InputBox';
import Modal from '../Modal';
import DropdownMenu from '../DropdownMenu';


const ExpertForm = (props) => {
    const[hasSubmit, setHasSubmit] = useState(false);
    // const[type, setType] = useState(props.type);

    const period = [
        { value: '0', label: 'Less than 1 year'},
        { value: '1', label: '1 year'},
        { value: '2', label: '2 years'},
        { value: '3', label: '3 years'},
        { value: '4', label: '4 years'},
        { value: '5', label: '5 years'},
        { value: '6', label: '6 years'},
        { value: '7', label: '7 years'},
        { value: '8', label: '8 years'},
        { value: '9', label: '9 years'},
        { value: 'more than 10', label: '10+ years'}
    ]

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

    const handleClick = (value) => {
        setHasSubmit(value);
    }

    useEffect(() => {
        props.onSubmitClick(hasSubmit);
    })
    
    const action = (
        <>
        <div className="ui center aligned container">
            <button 
                className="ui button"
            >
                Cancel
            </button>
            <button 
                className="ui red button"
                onClick={() => handleClick(true)}
            >
                Submit
            </button>
        </div>
        </>
    )

    const modalHeader = (
        <>
        <div className="ui container">
            <h2>Complete your signup</h2>
            <p>This should only take 2 minutes or less</p>
        </div>
        </>
    )

    const currentCompany = (
        <>
            <div className="row">
                <InputBox
                    description="Current Company:"
                    placeholder="Current Company"
                />
            </div>
        </>
    )

    const currentRole = (
        <>
            <div className="row">
                <InputBox
                    description="Current Role:"
                    placeholder="Current Role"
                />
            </div>
        </>
    )

    const workingExperience = (
        <>
            <div className="row">
                <div className="four wide column">
                    <h3>Total Working Experience:</h3>
                </div>
                <div className="six wide column">
                    <DropdownMenu
                        array={period}
                        content="Select your experience"
                        multi={false}
                    />
                </div>
            </div>
        </>
    )

    const interests = (
        <>
            <div className="row">
                <div className="four wide column" style={{ marginTop: '5px' }}>
                    <h3>Areas Of Interest:</h3>
                </div>
                <div className="eight wide column">
                    <DropdownMenu
                        array={interestArray}
                        content="Interests"
                        multi={true}
                    />
                </div>
            </div>
        </>
    )

    const progLang = (
        <>
            <div className="row">
                <div className="four wide column">
                    <h3>Programming Languages:</h3>
                </div>
                <div className="eight wide column" style={{ marginTop: '9px' }}>
                    <DropdownMenu
                        array={progLangArray}
                        content="Programming Languages"
                        multi={true}
                    />
                </div>
            </div>
        </>
    )

    const content = (
        <>
            <div className="ui grid">
                {currentCompany}
                {currentRole}
                {workingExperience}
                {interests}
                {progLang}
            </div>
        </>
    )
    
    if(props.type !== 'Expert'){
        return null
    }

    return (
        <Modal 
            color="#CA3B33"
            headerColor="white"
            description={modalHeader}
            content={content}
            actions={action}
        />
    )
}

export default ExpertForm;