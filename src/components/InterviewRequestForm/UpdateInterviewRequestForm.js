import React, { useState, useCallback, useEffect } from 'react';
import NavBar from './NavBar';
import DropdownMenu from '../DropdownMenu';
import AppointmentScheduler from '../bookingForm/AppointmentScheduler';
import Modal from '../Modal';
import moment from 'moment/moment.js';
import Axios from 'axios';
import history from '../../history';
import { useAuth0 } from '../../react-auth0-spa';
import { bookingsUrl } from '../../api_callers/apis.json';

const UpdateInterviewRequestFrom = props => {
  const currentMoment = moment();
  const [progLangArray, setProgLangArray] = useState([]);
  const [interestArray, setInterestArray] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await Axios.get('http://localhost:5000/info/topics');
      return response.data;
    };

    fetchTopics().then(data => {
      const topics = data.topics.map(element => element.topicName);
      topics.forEach(topic => {
        setInterestArray(prevState => {
          return [...prevState, { value: topic, label: topic }];
        });
      });
    });
  }, []);

  useEffect(() => {
    const fetchProgLanguages = async () => {
      const response = await Axios.get(
        'http://localhost:5000/info/prog-languages'
      );
      return response.data;
    };

    fetchProgLanguages().then(data => {
      const progLanguages = data.progLanguages.map(element => element.progName);
      progLanguages.forEach(prog =>
        setProgLangArray(prevState => {
          return [...prevState, { value: prog, label: prog }];
        })
      );
    });
  }, []);

  const [topicsState, setTopicsState] = useState({
    value: props.location.state.topic ? props.location.state.topic : '',
    label: props.location.state.topic ? props.location.state.topic : ''
  });
  const [showModal, setShowModal] = useState(false);
  const [lang, setLang] = useState([]);
  const [userTiming, setUserTiming] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [otherAccType, setOtherAccType] = useState(
    props.location.state.otherAccType ? props.location.state.otherAccType : ''
  );

  const initialUserTiming = [];

  const parseDate = date => {
    const m = moment(date, 'ddd, D MMM YYYY');
    return m.format('DD/MM/YYYY');
  };

  props.location.state.timingsByBookingId[0].timeslots.forEach(slot => {
    initialUserTiming.push({
      date: parseDate(slot.date),
      timingSlots: slot.timings
    });
  });

  //update prog lang state, once component is mounted, according to initial booking information
  useEffect(() => {
    props.location.state.langs.map(item => {
      setLang(prevstate => {
        return [...prevstate, { value: item, label: item }];
      });
    });
  }, []);

  useEffect(() => {
    setTopicsState({
      value: props.location.state.topic,
      topic: props.location.state.topic
    });
  }, []);

  const submitButton =
    topicsState.length === 0 ||
    lang.length === 0 ||
    otherAccType === '' ||
    userTiming.length === 0
      ? 'ui primary disabled button'
      : 'ui primary button';

  const topicHandler = useCallback(keyPair => {
    setTopicsState(keyPair);
  }, []);

  const langHandler = useCallback(keyPair => {
    setLang(keyPair);
  }, []);

  const accountHeader = (
    <>
      <h3>Who do you want to practice with?</h3>
    </>
  );

  const accountCheckbox = (
    <>
      <div className='row' style={{ width: '10px' }}>
        <div className='ui checkbox'>
          <input
            type='checkbox'
            onChange={() =>
              otherAccType ? setOtherAccType('') : setOtherAccType('Normal')
            }
            disabled={
              otherAccType && otherAccType !== 'Normal' ? 'disabled' : null
            }
            checked={otherAccType === 'Normal' ? 'checked' : ''}
          />
          <label>Normal</label>
        </div>
      </div>
      <div className='row' style={{ width: '10px', paddingTop: '5px' }}>
        <div className='ui checkbox'>
          <input
            type='checkbox'
            onChange={() =>
              otherAccType ? setOtherAccType('') : setOtherAccType('Expert')
            }
            disabled={
              otherAccType && otherAccType !== 'Expert' ? 'disabled' : null
            }
            checked={otherAccType === 'Expert' ? 'checked' : ''}
          />
          <label>Expert</label>
        </div>
      </div>
    </>
  );

  const topics = (
    <>
      <div className='row'>
        <h3>Topic</h3>
      </div>
      <div className='row' style={{ paddingTop: '6px' }}>
        <DropdownMenu
          defaultValue={[
            { value: topicsState.value, label: topicsState.value }
          ]}
          array={interestArray}
          valueChanged={topicHandler}
          multi={false}
        />
      </div>
    </>
  );

  const progLang = (
    <>
      <div className='row'>
        <h3>Programming Languages</h3>
      </div>
      <div className='row' style={{ paddingTop: '6px' }}>
        <DropdownMenu
          defaultValue={lang}
          array={progLangArray}
          content='Choose your programming languages'
          multi={true}
          valueChanged={langHandler}
        />
      </div>
    </>
  );

  const actions = (
    <>
      <button className='ui button' onClick={() => history.push('/dashboard')}>
        Cancel
      </button>
      <button className={submitButton} onClick={() => setShowModal(true)}>
        Submit
      </button>
    </>
  );

  const modalActions = (
    <>
      <div className='ui center aligned container'>
        <button className='ui button' onClick={() => setShowModal(false)}>
          Back
        </button>
        <button className='ui primary button' onClick={() => handleClick(true)}>
          Submit
        </button>
      </div>
    </>
  );

  const modalHeader = (
    <>
      <div className='ui container'>
        <h2>Booking Summary</h2>
      </div>
    </>
  );

  const modalContent = (
    <>
      <div className='ui centered grid' style={{ marginLeft: '30px' }}>
        <div className='row'>
          <div className='three wide column' style={{ fontSize: '17px' }}>
            Practice with:
          </div>
          <div className='three wide column'>
            <span style={{ fontSize: '17px' }}>{otherAccType}</span>
          </div>
        </div>
        <div className='row'>
          <div className='three wide column' style={{ fontSize: '17px' }}>
            Topic:
          </div>
          <div className='three wide column'>
            <span style={{ fontSize: '17px' }}>{topicsState.value}</span>
          </div>
        </div>
        <div className='row'>
          <div className='three wide column' style={{ fontSize: '17px' }}>
            Programming Languages:
          </div>
          <div className='three wide column'>
            {lang.length > 0 &&
              lang.map((item, index) => {
                return (
                  <span key={index} style={{ fontSize: '17px' }}>
                    {item.value} &nbsp;
                  </span>
                );
              })}
          </div>
        </div>
        <div className='row'>
          <div className='one wide column' />
          <div
            className='three wide column'
            style={{ fontSize: '17px', display: 'flex', alignItems: 'center' }}
          >
            Date & Timeslots:
          </div>
          <div className='four wide column'>
            {userTiming.length > 0 &&
              userTiming.map((item, position) => {
                return (
                  <div
                    className='row'
                    key={position}
                    style={{ padding: '5px 5px' }}
                  >
                    <div className='one wide column'>
                      <span
                        style={{ fontSize: '17px', borderBottom: '1px solid' }}
                      >
                        {item.date}:{' '}
                      </span>
                    </div>
                    <div className='two wide column'>
                      {item.timeSlots &&
                        item.timeSlots.map((timeSlot, index) => {
                          return (
                            <span
                              key={position + index}
                              style={{ fontSize: '17px' }}
                            >
                              {timeSlot} &nbsp;
                            </span>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );

  const userTimingHandler = useCallback(value => {
    setUserTiming(value);
  }, []);

  const handleClick = useCallback(value => {
    setIsSubmit(value);
    submitBookingForm(otherAccType, topicsState, lang, userTiming);
    history.push('/dashboard');
  }, []);

  const { getTokenSilently } = useAuth0();
  const submitBookingForm = async (
    otherAccType,
    topic,
    progLanguages,
    timeslots
  ) => {
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

      await Axios.post(bookingsUrl, data, header);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {showModal && (
        <Modal
          color='#003EB6'
          headerColor='white'
          description={modalHeader}
          content={modalContent}
          actions={modalActions}
        />
      )}
      <NavBar />
      <div className='row' style={{ height: '3em' }} />
      <div
        className='ui two column grid'
        style={{ marginTop: '2em', marginLeft: '20px', width: '100vw' }}
      >
        <div className='four wide column'>
          <div className='row' style={{ height: '16em' }} />
          <div className='ui three column grid'>
            <div className='one wide column' />
            <div className='seven wide column'>{accountHeader}</div>
            <div
              className='six wide column'
              style={{ marginTop: '4px', paddingRight: '8px' }}
            >
              {accountCheckbox}
            </div>
          </div>
          <div className='row' style={{ paddingTop: '2em' }}>
            <div className='ui two column grid'>
              <div className='one wide column' />
              <div className='twelve wide column'>{topics}</div>
            </div>
          </div>
          <div className='row' style={{ paddingTop: '2em' }}>
            <div className='ui two column grid'>
              <div className='one wide column' />
              <div className='twelve wide column'>{progLang}</div>
            </div>
          </div>
          <div className='row' style={{ paddingTop: '4em' }}>
            <div className='ui two column grid'>
              <div className='three wide column' />
              <div className='ten wide column'>{actions}</div>
            </div>
          </div>
        </div>

        <div
          className='twelve wide column'
          style={{ height: '95vh', borderLeft: '1px solid' }}
        >
          <div className='row' style={{ height: '9em' }} />
          <AppointmentScheduler
            moment={currentMoment}
            userTimingCallback={userTimingHandler}
            userTiming={initialUserTiming}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateInterviewRequestFrom;