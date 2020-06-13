import React   from 'react';
import Button  from '../../Button/Button';

import './EventList.scss';

function EventList({allEvents, onSelectedEvent}) {

    const reverseEvents = () => {

        const newEvents = [];

        for(let x = allEvents.length -1; 0 <= x; --x)
            newEvents.push(allEvents[x]);

        return newEvents;
    }

    // console.log(allEvents, 'EventList is rendered');

    return (
        <>
        { reverseEvents().map(event => (
            <div key={event._id} className="events__list-item">
                <div className="events__list--post">
                    <h1>{event.title}</h1>
                    <p className="events__list--poster"> By {event.creator.email.split('@')[0]} ─ {new Date(event.date).toLocaleDateString()}</p>
                </div>
                <Button title="View" onTrigger={onSelectedEvent.bind(this, event)} color />
            </div>
        )) }
        </>
    )
}

export default React.memo(EventList, (prevProps, nextProps) => {
    // console.log(prevProps, nextProps);
    return prevProps.allEvents === nextProps.allEvents
});