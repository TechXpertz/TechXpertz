import React from 'react';
import { useAuth0 } from '../../react-auth0-spa';
import { Rating } from 'semantic-ui-react';
import LoaderPage from '../LoaderPage';
import './index.css';

const ProfileContent = () => {
  const { loading, user, logout, isAuthenticated } = useAuth0();
  console.log(user);

  const actions = (
    <>
      <button className='ui primary large button'>Edit</button>
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

  const RightBar = () => {
    return (
      <>
        <div className='ui grid' style={{ height: '70vh' }}>
          <div className='row' style={{ marginBottom: '10px' }}>
            <div className='two wide column information-content'>Name</div>
            <div className='two wide column information-content'>
              {user.name}
            </div>
          </div>
          <div className='row' style={{ marginBottom: '10px' }}>
            <div className='two wide column information-content'>Email</div>
            <div className='two wide column information-content'>
              {user.email}
            </div>
          </div>
          <div className='row' style={{ marginBottom: '10px' }}>
            <div className='two wide column information-content'>Education</div>
            <div className='two wide column information-content'>
              Undergraduate
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
            <div className='two wide column information-content'>
              Interview Confidence Level
            </div>
            <div className='two wide column information-content'>
              <Rating
                icon='star'
                maxRating={5}
                size='massive'
                defaultRating={3}
                disabled
              />
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
            <div className='two wide column information-content'>Interests</div>
            <div
              className='two wide column'
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <div className='interest-button'>Frontend</div>
              <div className='interest-button'>Backend</div>
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
            <div className='two wide column information-content'>
              Programming Languages
            </div>
            <div
              className='two wide column'
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <div className='interest-button'>Java</div>
              <div className='interest-button'>JavaScript</div>
            </div>
          </div>
          <div className='row' />
        </div>
      </>
    );
  };

  if (loading || !user) {
    return <LoaderPage />;
  }

  return (
    <>
      <div className='ui grid' style={{ padding: '50px' }}>
        <div className='four wide column' style={{ borderRight: '1px solid' }}>
          <LeftBar />
        </div>
        <div className='ten wide column' style={{ marginLeft: '20px' }}>
          <RightBar />
        </div>
      </div>
      <div className='actions-style'>{actions}</div>
    </>
  );
};

export default ProfileContent;
