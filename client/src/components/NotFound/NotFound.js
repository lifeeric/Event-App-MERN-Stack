import React, { useCallback } from 'react';
import Button from '../Button/Button';
import './NotFound.scss';
import { useHistory } from 'react-router-dom';

export default function NotFound() {
    const history = useHistory();

    const takeMeHome = useCallback(() => history.push('/events'), [history]);
    return (
        <>
        <div className="box">
            <div className="box__container">
                <h1> Not foud</h1>
                <h1 className="box__container--404">404</h1>
            </div>
            <Button onTrigger={takeMeHome} title="Get Me Home" />
        </div>
        </>
    )
}
