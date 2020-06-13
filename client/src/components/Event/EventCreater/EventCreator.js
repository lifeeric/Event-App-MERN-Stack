import React from 'react';
import Button from '../../Button/Button';

import './EventCreator.scss';

export default function EventCreator({modelBoxHandler}) {
    return (
        <div className="events__create">
            <h1 className="events__create--title"> So What is the plan? </h1>
            <Button onTrigger={modelBoxHandler} title="Create New Event" />
        </div>
    )
}
