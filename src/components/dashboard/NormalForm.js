import React, { useState } from 'react';
import Modal from '../Modal';
import StarRating from '../StarRating';
import DropdownMenu from '../DropdownMenu';


const NormalForm = (props) => {
    const [rating, setRating] = useState(0);
    const [hoverState, setHoverState] = useState(0);
    const stars= [1,2,3,4,5]; 

    const educationArray = [
        { value: 'No Degree', label: 'No Degree'},
        { value: 'Undergraduate', label: 'Undergraduate'},
        { value: 'Graduate', label: 'Graduate'}
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

    const action = (
        <>
        <div className="ui center aligned container">
            <button className="ui button">Cancel</button>
            <button className="ui primary button">Submit</button>
        </div>
        </>
    )

    const modalHeader = (
        <>
        <div className="ui container">
            <h2>Complete your signup</h2>
            <p style={{ fontWeight: 'lighter'}}>This should only take 2 minutes or less</p>
        </div>
        </>
    )

    const education = (
        <>
            <div className="row">
                <div className="four wide column">
                    <h3 style={{ marginTop: '5.5px' }}>Education Level:</h3>
                </div>
                <div className="four wide column">
                    <DropdownMenu 
                        array={educationArray}
                        content="Select Status"
                        multi={false}
                    />
                </div>
            </div>
        </>
    )

    const interview = (
        <>
        <div className="row">
            <div className="four wide column">
                <h3>Have You Been To A Technical Interview Before?</h3>
            </div>
            <div className="three wide column" style={{ top:"12px" }}>
                <div className="row">
                    <div className="ui checkbox">
                        <input type="checkbox" />
                        <label style={{ fontSize: '16px'}}>Yes</label>
                    </div>
                </div>
                <div className='row'>
                    <div className="ui checkbox">
                        <input type="checkbox" />
                        <label style={{ fontSize: '16px'}}>No</label>
                    </div>
                </div>
            </div>
            <div className="four wide column" style={{ paddingRight: '3px'}}>
                <h3 style={{ marginTop: '5px' }}>Rate Your Current Level At Technical Interviews</h3>
            </div>
                {stars.map((i) => {
                    return(
                        <div className="one wide column" style={{ marginTop: '10px' }} key={i}>
                            <StarRating 
                            key={i} 
                            starId={i}
                            rating={hoverState || rating}
                            onMouseEnter={() => setHoverState(i)}
                            onMouseLeave={() => setHoverState(0)}
                            onClick={() => setRating(i)}
                            />
                        </div>
                    );
                })}
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
                    {education}
                    {interview}
                    {interests}
                    {progLang}
        </div>
        </>
    )
    
    if(props.type !== 'Normal'){
        return null
    }

    return (
        <Modal 
            color="#003EB6"
            headerColor="white"
            description={modalHeader}
            content={content}
            actions={action}
            style={{ height: '50px'}}
        />
    )
}

export default NormalForm;