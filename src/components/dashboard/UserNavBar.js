import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import Logo from '../../images/Logo.png';
import '../App.css';
import './Dashboard.css';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth0();
  return (
    <div className='ui inverted top fixed menu borderless'>
      <img
        src={Logo}
        alt='Application logo'
        className='logo'
        style={{ marginTop: '12px', marginLeft: '40px' }}
      />
      <div className='right menu'>
        <Link
          to='/about'
          className='item'
          id='fonts'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        >
          About us
        </Link>
        <Link
          to='/FAQ'
          className='item'
          id='fonts'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        >
          FAQ
        </Link>
        <div className='item'>
          <i className='grey bell icon' />
        </div>
        <div className='item'>
          <div className='ui dropdown'>
            <button className='circular ui icon black button'>
              <i className='caret down icon' />
            </button>
            <div className='menu'>
              <div className='item' values='Profile'>
                Profile
              </div>
              <div className='item'>Log out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
