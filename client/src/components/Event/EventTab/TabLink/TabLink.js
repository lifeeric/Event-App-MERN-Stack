import React from 'react';
import { NavLink } from 'react-router-dom';


import './TabLink.scss';

export default function TabLink({title, permalink, onTrigger}) {
    return (
        <li> 
            <NavLink to={permalink}
                onClick={onTrigger.bind(this, permalink)}
            > 
                {title}
            </NavLink> 
        </li>
    )
}
