import React, { useState, useEffect } from 'react';
import { Rating } from 'semantic-ui-react';
import Modal from '../Modal';
import StarRating from '../StarRating';
import DropdownMenu from '../DropdownMenu';
import Axios from 'axios';
import { normalBackground, postAccType } from '../../api_callers/apis.json';
import { useAuth0 } from "../../react-auth0-spa";
import { topicsAPI, progsAPI } from '../../api_callers/apis.json';

const NormalForm = (props) => {

    const { getTokenSilently } = useAuth0();

    const interestArray = [];
    const progLangArray = [];

    React.useEffect(() => {

        if (props.type !== 'Normal') {
            return;
        }

        const fetchTopics = async () => {
            const response = await Axios.get(topicsAPI);
            return response.data;
        }

        fetchTopics().then(data => {
            const topics = data.topics
                .map(element => element.topicName);
            topics.forEach(topic => interestArray.push({ value: topic, label: topic }));
        });
        // console.log('interestArr', interestArray);

        const fetchProgLanguages = async () => {
            const response = await Axios.get(progsAPI);
            return response.data;
        }

        fetchProgLanguages().then(data => {
            const progLanguages = data.progLanguages
                .map(element => element.progName)
            progLanguages.forEach(prog => progLangArray.push({ value: prog, label: prog }));
        });
        // console.log('progArr', progLangArray);

    }, [interestArray, progLangArray, props.type]);

    const sendForm = async (topics, progLang, educationType, check) => {
        try {
            const token = await getTokenSilently();
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const myTopics = topics.map(topic => {
                return { topicName: topic.value };
            });

            const progLanguages = progLang.map(prog => {
                return { progName: prog.value };
            });

            const data = {
                education: educationType.value,
                hasExperience: check,
                topics: myTopics,
                progLanguages,
                interviewLevel: rating
            }

            console.log('data', data);

            const normBackground = Axios.post(normalBackground, data, header);
            const accType = Axios.post(postAccType, { accountType: 'Normal' }, header);
            await Promise.all([normBackground, accType])

        } catch (error) {
            console.error(error);
        }
    };

    const [rating, setRating] = useState(0);
    const [hoverState, setHoverState] = useState(0);
    const [check, setCheck] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    //const [currentType, setCurrentType] = useState('Normal');
    const [educationType, setEducationType] = useState([]);
    const [topics, setTopics] = useState([]);
    const [lang, setLang] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);


    const submitButton = (check !== ''
        && (educationType && educationType.length !== 0)
        && (topics && topics.length !== 0)
        && (lang && lang.length !== 0))
        ? "ui primary button" : "ui primary disabled button"


    const educationArray = [
        { value: 'No Degree', label: 'No Degree' },
        { value: 'Undergraduate', label: 'Undergraduate' },
        { value: 'Graduate', label: 'Graduate' }
    ]

    const handleClick = async (value) => {
        setIsSubmit(value);
        await sendForm(topics, lang, educationType, check);
    }

    const checkType = (value) => {
        props.onTypeClick(value);
    }

    const educationHandler = (keyPair) => {
        setEducationType(keyPair);
    }

    const topicHandler = (keyPair) => {
        setTopics(keyPair);
    }

    const langHandler = (keyPair) => {
        setLang(keyPair);
    }

    const handleRate = (e, { rating, maxRating }) => {
        setCurrentLevel(rating);
    }
    console.log(currentLevel);

    useEffect(() => {
        props.onSubmitClick(isSubmit);
    }, [isSubmit, props]);

    const action = (
        <>
            <div className="ui center aligned container">
                <button
                    className="ui button"
                    onClick={() => checkType('AccountType')}
                >
                    Back
            </button>
                <button
                    className={submitButton}
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
                <p style={{ fontWeight: 'lighter' }}>This should only take 2 minutes or less</p>
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
                        valueChanged={educationHandler}
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
                <div className="three wide column" style={{ top: "18px" }}>
                    <div className="row">
                        <div className="ui checkbox">
                            <input
                                type="checkbox"
                                onClick={() => check ? setCheck('') : setCheck('Yes')}
                                disabled={check && check !== 'Yes' ? "disabled" : null}
                            />
                            <label style={{ fontSize: '16px' }}>Yes</label>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="ui checkbox">
                            <input
                                type="checkbox"
                                onClick={() => check ? setCheck('') : setCheck('No')}
                                disabled={check && check !== 'No' ? "disabled" : null}
                            />
                            <label style={{ fontSize: '16px' }}>No</label>
                        </div>
                    </div>
                </div>
                <div className="four wide column" style={{ paddingRight: '3px', display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ marginTop: '5px' }}>Rate Your Current Level At Technical Interviews</h3>
                </div>
                <div className="five wide column" style={{ display: "flex", alignItems: 'center' }}>
                    <Rating
                        icon="star"
                        maxRating={5}
                        size="massive"
                        onRate={handleRate}
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
                        valueChanged={topicHandler}
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
                        valueChanged={langHandler}
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

    if (props.type !== 'Normal' || props.hasSubmittedForm) {
        return null
    }

    return (
        <Modal
            color="#003EB6"
            headerColor="white"
            description={modalHeader}
            content={content}
            actions={action}
            style={{ height: '50px' }}
        />
    )
}

export default NormalForm;