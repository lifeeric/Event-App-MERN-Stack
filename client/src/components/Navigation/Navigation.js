import React        from 'react';
import { NavLink, useLocation, useHistory }  from 'react-router-dom';
import Logo         from '../../assests/images/logo.png';
import Backdrop     from '../Backdrop/Backdrop';
import AuthContext  from '../../context/global-context';

import './Navigation.scss';

export default () => {

    // Router dom
    const {pathname} = useLocation();
    const history    = useHistory();

    // Accessing to context
    const { token, logout } = React.useContext(AuthContext);

    const [hide, setHide] = React.useState('');
    const [icon, setIcon] = React.useState('');

    // Menu Toggler
    const menuToggler = () => {
        if( hide === '' )
        {
            setHide('open')
            setIcon('change');
        }
        else 
        {
            setHide('');
            setIcon('');
        }

    }

    // LogMeOut 
    const logMeOut = () => {
        logout();
        history.push('/events');
    }

    return (
        <>
        <nav className='Navigation'>
            <div className={`Navigation__dots ${icon}`} onClick={menuToggler}>
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
            </div>
            <img className='Navigation__logo' alt="Profolio project for learning || source code of project reactjs || react js project" src={Logo} />
            <ul className={`Navigation__list ${hide}`}>
                <li className='Navigation__list-item'> <NavLink to="/events" isActive={() => ['/events', '/myevents'].includes(pathname)} >Events </NavLink> </li>
                { token && 
                    (
                        <>
                        <li className='Navigation__list-item'> <NavLink to="/bookings">Bookings </NavLink> </li> 
                        <li className='Navigation__list-item'> <NavLink to="/profile">Profile </NavLink> </li> 
                        <li className='Navigation__list-item'> <NavLink to="/events" isActive={() => null} onClick={logMeOut}>Logout </NavLink> </li> 
                        </>
                    )
                }
                { token === '' ?
                    (
                        <>
                        <li className='Navigation__list-item'> <NavLink to="/auth">Login </NavLink> </li>
                        <li className='Navigation__list-item'> <NavLink to="/newauth" className="register">Register </NavLink> </li>
                        </>
                    ) : ''
                }
            </ul>
        </nav>
        { hide === 'open' && <Backdrop onTrigger={menuToggler} /> }
        </>
    );
}