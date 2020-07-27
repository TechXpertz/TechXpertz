import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAuth0 } from '../../react-auth0-spa';
import { Rating } from 'semantic-ui-react';
import LoaderPage from '../LoaderPage';
import DropdownMenu from '../DropdownMenu';
import './index.css';
import {
  getBackground,
  normalBackground,
  expertBackground,
  topicsAPI,
  progsAPI
} from '../../api_callers/apis.json';
import axios from 'axios';

const ProfileContent = () => {
  const { loading, user, getTokenSilently } = useAuth0();
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
  const [background, setBackground] = useState();
  const [isEdit, setIsEdit] = useState(false);

  console.log(background);

  const workingExpStr = exp => {
    return exp === undefined ? exp : period[exp].label;
  };

  const getUserBackground = async () => {
    try {
      const token = await getTokenSilently();
      const header = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.get(getBackground, header);
      console.log(response.data);
      setBackground(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!loading) {
      getUserBackground();
    }
  }, [loading]);

  const actions = (
    <>
      <button
        className='ui primary large button'
        onClick={() => setIsEdit(!isEdit)}
      >
        Edit
      </button>
      <button className='ui red large button'>Delete</button>
    </>
  );

  const LeftBar = () => {
    if (loading || !user) {
      return <LoaderPage />;
    }
    return (
      <>
        <div className='image-container'>
          <img src={user.picture} alt='Profile' className='image-cropper' />
          <span className='image-name'>{user.name}</span>
        </div>
        <div
          className='sidebar-container'
          style={{ textDecoration: 'underline' }}
        >
          Public Profile
        </div>
      </>
    );
  };

  const RightBar = props => {
    const { isEdit } = props;
    if (isEdit) {
      return <></>;
    } else {
      return (
        <>
          <div className='ui grid' style={{ height: '70vh' }}>
            <div
              className='row'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div className='three wide column information-content'>Name</div>
              <div className='four wide column information-content'>
                {background.background.username}
              </div>
            </div>
            <div
              className='row'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div className='three wide column information-content'>Email</div>
              <div className='four wide column information-content'>
                {user.email}
              </div>
            </div>
            {!background.isExpert && (
              <div
                className='row'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div className='three wide column information-content'>
                  Education
                </div>
                <div className='four wide column information-content'>
                  {background.background.education}
                </div>
              </div>
            )}
            {background.isExpert && (
              <div
                className='row'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div className='three wide column information-content'>
                  Company
                </div>
                <div className='four wide column information-content'>
                  {background.background.company}
                </div>
              </div>
            )}
            {background.isExpert && (
              <div
                className='row'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div className='three wide column information-content'>
                  Company Role
                </div>
                <div className='four wide column information-content'>
                  {background.background.companyRole}
                </div>
              </div>
            )}
            {!background.isExpert && (
              <div
                className='row'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div className='three wide column information-content'>
                  Interview Confidence Level
                </div>
                <div className='four wide column information-content'>
                  <Rating
                    icon='star'
                    maxRating={5}
                    size='massive'
                    defaultRating={background.background.interviewLevel}
                    disabled
                  />
                </div>
              </div>
            )}
            {background.isExpert && (
              <div
                className='row'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <div className='three wide column information-content'>
                  Total Working Experience
                </div>
                <div className='four wide column information-content'>
                  {workingExpStr(background.background.workingExp)}
                </div>
              </div>
            )}
            <div
              className='row'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div className='three wide column information-content'>
                Interests
              </div>
              <div
                className='eight wide column'
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                {background.topics.map((value, index) => (
                  <div className='interest-button' key={index}>
                    {value}
                  </div>
                ))}
              </div>
            </div>
            <div
              className='row'
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <div className='three wide column information-content'>
                Programming Languages
              </div>
              <div
                className='eight wide column'
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                {background.progLanguages.map((value, index) => (
                  <div className='interest-button' key={index}>
                    {value}
                  </div>
                ))}
              </div>
            </div>
            <div className='row' />
          </div>
        </>
      );
    }
  };

  const ProfilePage = props => {
    return (
      <>
        <div className='ui grid' style={{ padding: '50px' }}>
          <div
            className='four wide column'
            style={{ borderRight: '1px solid' }}
          >
            <LeftBar />
          </div>
          <div className='ten wide column' style={{ marginLeft: '20px' }}>
            <RightBar />
          </div>
        </div>
        <div className='actions-style'>{!isEdit && actions}</div>
      </>
    );
  };

  const ProfileEditPage = props => {
    const {
      userName,
      userEmail,
      userCompany,
      userCompanyRole,
      userEducation,
      userInterviewLevel,
      userWorkingExp,
      userProgLangs,
      userTopics
    } = props;
    const topic = userTopics.map(topic => {
      return { value: topic, label: topic };
    });
    const lang = userProgLangs.map(lang => {
      return { value: lang, label: lang };
    });
    const [editedName, setEditedName] = useState(userName);
    const [editedEmail, setEditedEmail] = useState(userEmail);
    const [editedEducation, setEditedEducation] = useState(userEducation);
    const [editedCompany, setEditedCompany] = useState(userCompany);
    const [editedCompanyRole, setEditedCompanyRole] = useState(userCompanyRole);
    const [editedInterview, setEditedInterview] = useState(userInterviewLevel);
    const [editedWorkingExp, setEditedWorkingExp] = useState({
      value: userWorkingExp,
      label: workingExpStr(userWorkingExp)
    });
    const [editedUserTopic, setEditedUserTopic] = useState(topic);
    const [editedUserProgLang, setEditedUserProgLang] = useState(lang);
    const [interestArray, setInterestArray] = useState([]);
    const [progLangArray, setProgLangArray] = useState([]);
    const educationArray = [
      { value: 'No Degree', label: 'No Degree' },
      { value: 'Undergraduate', label: 'Undergraduate' },
      { value: 'Graduate', label: 'Graduate' }
    ];
    console.log(editedCompany);

    const submitButton =
      !editedName ||
      (background.isExpert && (!editedCompany || !editedCompanyRole)) ||
      editedUserTopic === null ||
      editedUserProgLang === null
        ? 'ui primary large disabled button'
        : 'ui primary large button';

    const fetchTopics = async () => {
      const response = await Axios.get(topicsAPI);
      const topics = response.data.topics.map(element => {
        return {
          value: element.topicName,
          label: element.topicName
        };
      });
      setInterestArray(topics);
    };

    const fetchProgLanguages = async () => {
      const response = await Axios.get(progsAPI);
      const langs = response.data.progLanguages.map(element => {
        return {
          value: element.progName,
          label: element.progName
        };
      });
      setProgLangArray(langs);
    };

    useEffect(() => {
      fetchTopics();
      fetchProgLanguages();
    }, []);

    const onNameChange = event => {
      setEditedName(event.target.value);
    };

    const onCompanyChange = event => {
      setEditedCompany(event.target.value);
    };

    const onCompanyRoleChange = event => {
      setEditedCompanyRole(event.target.value);
    };

    const onEducationChange = value => {
      setEditedEducation(value.value);
    };

    const onInterviewLevelChange = (e, { rating }) => {
      setEditedInterview(rating);
    };

    const onWorkingExpChange = event => {
      setEditedWorkingExp(event);
    };

    const handleTopics = value => {
      setEditedUserTopic(value);
    };

    const handleProgLang = value => {
      setEditedUserProgLang(value);
    };

    const onSubmit = async event => {
      setIsEdit(!isEdit);
      const token = await getTokenSilently();
      const topics = editedUserTopic.map(topic => {
        return {
          topicName: topic.value
        };
      });
      const progLanguages = editedUserProgLang.map(lang => {
        return {
          progName: lang.value
        };
      });
      const header = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const topicSelected = editedUserTopic.map(topic => {
        return topic.value;
      });
      const langSelected = editedUserProgLang.map(lang => {
        return lang.value;
      });

      if (background.isExpert) {
        const editedExpertBackground = {
          username: editedName,
          company: editedCompany,
          companyRole: editedCompanyRole,
          workingExp: editedWorkingExp.value,
          topics,
          progLanguages
        };
        setBackground({
          background: {
            username: editedName,
            company: editedCompany,
            companyRole: editedCompanyRole,
            workingExp: editedWorkingExp.value
          },
          isExpert: background.isExpert,
          topics: topicSelected,
          progLanguages: langSelected
        });
        await axios.patch(expertBackground, editedExpertBackground, header);
      } else {
        const editedNormalBackground = {
          username: editedName,
          education: editedEducation,
          interviewLevel: editedInterview,
          hasExperience: background.background.hasExperience,
          topics,
          progLanguages
        };
        setBackground({
          background: {
            username: editedName,
            education: editedEducation,
            interviewLevel: editedInterview,
            hasExperience: background.background.hasExperience
          },
          isExpert: background.isExpert,
          topics: topicSelected,
          progLanguages: langSelected
        });
        await axios.patch(normalBackground, editedNormalBackground, header);
      }
    };

    if (loading || !user) {
      return <LoaderPage />;
    } else {
      return (
        <>
          <div className='ui grid' style={{ padding: '50px' }}>
            <div
              className='four wide column'
              style={{ borderRight: '1px solid' }}
            >
              <LeftBar />
            </div>
            <div className='ten wide column' style={{ marginLeft: '20px' }}>
              <div className='ui grid' style={{ height: '70vh' }}>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <div className='three wide column information-content'>
                    Name
                  </div>
                  <div className='five wide column information-content'>
                    <div className='ui mini input'>
                      <input
                        type='Name'
                        value={editedName}
                        onChange={onNameChange}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <div className='three wide column information-content'>
                    Email
                  </div>
                  <div className='five wide column information-content'>
                    {editedEmail}
                  </div>
                </div>
                {!background.isExpert && (
                  <div
                    className='row'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <div className='three wide column information-content'>
                      Education
                    </div>
                    <div className='five wide column information-content'>
                      <DropdownMenu
                        defaultValue={[
                          { value: editedEducation, label: editedEducation }
                        ]}
                        valueChanged={onEducationChange}
                        array={educationArray}
                      />
                    </div>
                  </div>
                )}
                {background.isExpert && (
                  <div
                    className='row'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <div className='three wide column information-content'>
                      Company
                    </div>
                    <div className='five wide column information-content'>
                      <div className='ui mini input'>
                        <input
                          type='Company'
                          value={editedCompany}
                          onChange={onCompanyChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {background.isExpert && (
                  <div
                    className='row'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}
                  >
                    <div className='three wide column information-content'>
                      Company Role
                    </div>
                    <div className='five wide column information-content'>
                      <div className='ui mini input'>
                        <input
                          type='Company-Role'
                          value={editedCompanyRole}
                          onChange={onCompanyRoleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {!background.isExpert && (
                  <div
                    className='row'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    <div className='three wide column information-content'>
                      Interview Confidence Level
                    </div>
                    <div className='five wide column information-content'>
                      <Rating
                        icon='star'
                        maxRating={5}
                        size='massive'
                        defaultRating={editedInterview}
                        onRate={onInterviewLevelChange}
                      />
                    </div>
                  </div>
                )}
                {background.isExpert && (
                  <div
                    className='row'
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    <div className='three wide column information-content'>
                      Total Working Eperience
                    </div>
                    <div className='seven wide column information-content'>
                      <DropdownMenu
                        multi={false}
                        defaultValue={[
                          {
                            value: userWorkingExp,
                            label: workingExpStr(userWorkingExp)
                          }
                        ]}
                        array={period}
                        valueChanged={onWorkingExpChange}
                      />
                    </div>
                  </div>
                )}
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <div className='three wide column information-content'>
                    Interests
                  </div>
                  <div className='nine wide column information-content'>
                    <DropdownMenu
                      multi={true}
                      defaultValue={editedUserTopic}
                      valueChanged={handleTopics}
                      array={interestArray}
                    />
                  </div>
                </div>
                <div
                  className='row'
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <div className='three wide column information-content'>
                    Programming Languages
                  </div>
                  <div className='nine wide column information-content'>
                    <DropdownMenu
                      multi={true}
                      defaultValue={editedUserProgLang}
                      array={progLangArray}
                      valueChanged={handleProgLang}
                    />
                  </div>
                </div>
                <div className='row' />
              </div>
            </div>
          </div>
          <div className='actions-style'>
            <button className={submitButton} onClick={onSubmit}>
              Submit
            </button>
            <button className='ui red large button'>Delete</button>
          </div>
        </>
      );
    }
  };

  if (loading || !user || !background) {
    return <LoaderPage />;
  } else if (!isEdit) {
    return <ProfilePage />;
  } else {
    return (
      <ProfileEditPage
        userName={background.background.username}
        userEmail={user.email}
        userCompany={background.background.company}
        userCompanyRole={background.background.companyRole}
        userEducation={background.background.education}
        userInterviewLevel={background.background.interviewLevel}
        userWorkingExp={background.background.workingExp}
        userProgLangs={background.progLanguages}
        userTopics={background.topics}
      />
    );
  }
};

export default ProfileContent;
