import React from 'react';
import history from '../../history';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import Logo from '../../images/Logo.png';
import '../App.css';
import './Dashboard.css';

const NavBar = props => {
  const { logout } = useAuth0();

  return (
    <div className='ui inverted top menu borderless'>
      <img
        src={Logo}
        alt='Application logo'
        className='logo'
        style={{ marginTop: '12px', marginLeft: '40px', cursor: 'pointer' }}
        onClick={() => history.push('/dashboard')}
      />
      <div className='right menu'>
        {/* <Link
          to='/about'
          className='item'
          id='fonts'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        > */}
        <div
          className='item'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        >
          About us
        </div>
        {/* </Link> */}
        {/* <Link
          to='/FAQ'
          className={props.selected.FAQ ? 'active item' : 'item'}
          id='fonts'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        > */}
        <div
          className='item'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        >
          FAQ
        </div>
        {/* </Link> */}
        <div className='item'>
          <i className='grey bell icon'></i>
        </div>
        <Link
          to='/profile'
          className={props.selected.profile ? 'active item' : 'item'}
          id='fonts'
          style={{ paddingRight: '30px', paddingLeft: '30px' }}
        >
          My Profile
        </Link>
        <div
          className='link item'
          onClick={() => logout()}
          style={{ marginRight: '10px' }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

export default NavBar;

{
  /* <div className='item'>
          <div className='ui dropdown' onClick={openDropdown}>
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
        </div> */
}

{
  /* <button className='circular ui icon black button'>
            <i className='caret down icon' onClick={() => setOpen(!open)} />
          </button>
          {open && dropdownMenu}
        </div> */
}
