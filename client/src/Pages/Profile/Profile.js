import React from 'react';
import Avatar from '../../assests/images/avatar.png';
import './Profile.scss';
import AuthContext from '../../context/global-context';

export default function Profile() {

    const { email } = React.useContext(AuthContext);

    return (
        <div className="profile">
            <h1 className="profile__header--text"> My Profile</h1>
            <div className="profile__box">
                <img className="profile__box--img" src={Avatar} alt="ReactJS project || event project using react" />
                <h3>Hello: {email}</h3>
            </div>
        </div>
    )
}
