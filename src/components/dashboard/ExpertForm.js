import React, { useState, useEffect } from 'react';
import InputBox from '../InputBox';
import Modal from '../Modal';
import DropdownMenu from '../DropdownMenu';
import Axios from 'axios';
import { checkPropTypes } from 'prop-types';
import { topicsAPI, progsAPI, expertBackground, postAccType } from '../../api_callers/apis.json';
import { useAuth0 } from "../../react-auth0-spa";



const ExpertForm = (props) => {

    const [hasSubmit, setHasSubmit] = useState(false);
    // const[type, setType] = useState(props.type);
    const interestArray = [];
    const progLangArray = [];

    const fetchTopics = async () => {
        const response = await Axios.get(topicsAPI);
        return response.data;
    }

    const fetchProgLanguages = async () => {
        const response = await Axios.get(progsAPI);
        return response.data;
    }

    if (props.type === 'Expert') {
        fetchTopics().then(data => {
            const topics = data.topics
                .map(element => element.topicName);
            topics.forEach(topic => interestArray.push({ value: topic, label: topic }));
        });
        //console.log('interestArr', interestArray);

        fetchProgLanguages().then(data => {
            const progLanguages = data.progLanguages
                .map(element => element.progName)
            progLanguages.forEach(prog => progLangArray.push({ value: prog, label: prog }));
        });
        //console.log('progArr', progLangArray);
    }

    const period = [
        { value: '0', label: 'Less than 1 year' },
        { value: '1', label: '1 year' },
        { value: '2', label: '2 years' },
        { value: '3', label: '3 years' },
        { value: '4', label: '4 years' },
        { value: '5', label: '5 years' },
        { value: '6', label: '6 years' },
        { value: '7', label: '7 years' },
        { value: '8', label: '8 years' },
        { value: '9', label: '9 years' },
        { value: '10', label: '10+ years' }
    ];

    const { getTokenSilently } = useAuth0();
    const [topics, setTopics] = useState([]);
    const [lang, setLang] = useState([]);
    const [exp, setExp] = useState();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');

    const topicHandler = (keyPair) => {
        setTopics(keyPair);
    }

    const langHandler = (keyPair) => {
        setLang(keyPair);
    }

    const expHandler = (keyPair) => {
        setExp(keyPair);
    }

    const companyHandler = (event) => {
        setCompany(event.target.value);
    }

    const roleHandler = (event) => {
        setRole(event.target.value);
    }

    const sendForm = async (topics, progLang, company, role, workingExp) => {
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
                company,
                companyRole: role,
                workingExp: workingExp.value,
                topics: myTopics,
                progLanguages
            }

            // console.log('data', data);

            const normBackground = Axios.post(expertBackground, data, header);
            const accType = Axios.post(postAccType, { accountType: 'expert' }, header);
            await Promise.all([normBackground, accType])

        } catch (error) {
            console.error(error);
        }
    };

    const checkType = (value) => {
        props.onTypeClick(value);
    }

    const handleClick = (value) => {
        sendForm(topics, lang, company, role, exp);
        setHasSubmit(value);
    }

    useEffect(() => {
        props.onSubmitClick(hasSubmit);
    });

    const submitBtn = company !== ''
        && role !== ''
        && (exp || exp === 0)
        && (topics && topics.length !== 0)
        && (lang && lang.length !== 0)
        ? 'ui red button'
        : 'ui red disabled button';

    const action = (
        <>
            <div className="ui center aligned container">
                <button
                    className="ui button"
                    onClick={() => checkType('AccountType')}
                >
                    Cancel
            </button>
                <button
                    className={submitBtn}
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
                    valueChanged={companyHandler}
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
                    valueChanged={roleHandler}
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
                        valueChanged={expHandler}
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
                {currentCompany}
                {currentRole}
                {workingExperience}
                {interests}
                {progLang}
            </div>
        </>
    )

    if (props.type !== 'Expert' || props.hasSubmittedForm) {
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