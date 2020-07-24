import React, { useState, useCallback, memo } from 'react';
import NavBar from './NavBar';
import DropdownMenu from '../DropdownMenu';
import AppointmentScheduler from '../bookingForm/AppointmentScheduler';
import Modal from '../Modal';
import moment from 'moment/moment.js';
import Axios from 'axios';
import history from '../../history';
import { useAuth0 } from '../../react-auth0-spa';
import { bookingsUrl } from '../../api_callers/apis.json';
import { topicsAPI, progsAPI, reschedule } from '../../api_callers/apis.json';

const InterviewRequestFrom = props => {
  const currentMoment = moment();
  const interestArray = [];
  const progLangArray = [];
  console.log(props.location.state);

  React.useEffect(() => {
    const fetchTopics = async () => {
      const response = await Axios.get(topicsAPI);
      return response.data;
    };

    fetchTopics().then(data => {
      const topics = data.topics.map(element => element.topicName);
      topics.forEach(topic =>
        interestArray.push({ value: topic, label: topic })
      );
    });

    const fetchProgLanguages = async () => {
      const response = await Axios.get(progsAPI);
      return response.data;
    };

    fetchProgLanguages().then(data => {
      const progLanguages = data.progLanguages.map(element => element.progName);
      progLanguages.forEach(prog =>
        progLangArray.push({ value: prog, label: prog })
      );
    });
  }, [interestArray, progLangArray]);

  const [topicsState, setTopicsState] = useState({
    value: '',
    label: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [lang, setLang] = useState([]);
  const [userTiming, setUserTiming] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [otherAccType, setOtherAccType] = useState(
    props.location.state.accType === 'Expert' ? 'Normal' : ''
  );
  console.log(otherAccType);

  //TODO for expert, set otherAccType to be normal

  const submitButton =
    topicsState.length === 0 ||
    lang.length === 0 ||
    otherAccType === '' ||
    userTiming.length === 0
      ? 'ui primary disabled button'
      : 'ui primary button';

  const topicHandler = keyPair => {
    setTopicsState(keyPair);
  };

  const langHandler = keyPair => {
    setLang(keyPair);
  };

  const { getTokenSilently } = useAuth0();
  const handleReschedule = async booking => {
    try {
      const token = await getTokenSilently();
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const data = {
        bookingId: booking
      };
      await Axios.delete(reschedule, { headers, data });
    } catch (err) {
      console.log(err);
    }
  };

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
            onChange={() => setOtherAccType('Normal')}
            checked={otherAccType === 'Normal' ? 'Normal' : ''}
          />
          <label>Normal</label>
        </div>
      </div>
      <div className='row' style={{ width: '10px', paddingTop: '5px' }}>
        <div className='ui checkbox'>
          <input
            type='checkbox'
            onChange={() => setOtherAccType('Expert')}
            checked={otherAccType === 'Expert' ? 'Expert' : ''}
          />
          <label>Expert</label>
        </div>
      </div>
    </>
  );

  const topics = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <DropdownMenu
        array={interestArray}
        content='Please select one topic'
        valueChanged={topicHandler}
      />
    </div>
  );

  const progLang = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <DropdownMenu
        array={progLangArray}
        content='Choose your programming languages'
        multi={true}
        valueChanged={langHandler}
      />
    </div>
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
          <div className='four wide column' style={{ overflow: 'auto' }}>
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
                      {item.timeSlots.map((timeSlot, index) => {
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

  const handleClick = value => {
    setIsSubmit(value);
    if (
      props &&
      props.location &&
      props.location.state &&
      props.location.state.reschedule
    ) {
      handleReschedule(props.location.state.bookingId);
    }
    submitBookingForm(otherAccType, topicsState, lang, userTiming);
    history.push('/dashboard');
  };

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
      <div className='ui two column grid' style={{ marginTop: '2em' }}>
        <div className='four wide column'>
          <div className='row' style={{ height: '16em' }} />
          <div className='ui three column grid' style={{ paddingLeft: '25px' }}>
            <div className='seven wide column'>
              {props.location.state.accType === 'Normal' && accountHeader}
            </div>
            <div className='six wide column' style={{ marginTop: '4px' }}>
              {props.location.state.accType === 'Normal' && accountCheckbox}
            </div>
          </div>
          <div
            className='row'
            style={{ paddingTop: '2em', paddingLeft: '20px' }}
          >
            <div>
              <h3>Topic</h3>
              {topics}
            </div>
          </div>
          <div
            className='row'
            style={{
              paddingTop: '2em',
              paddingLeft: '20px'
            }}
          >
            <div className='ui container'>
              <h3>Programming Languages</h3>
              {progLang}
            </div>
          </div>
          <div
            className='row'
            style={{
              paddingTop: '4em',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            {actions}
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
            userTiming={userTiming}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(InterviewRequestFrom);
