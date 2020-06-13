import React    from 'react';
import Model    from '../../Model/Model';
import Backdrop from '../../Backdrop/Backdrop';
import Spinner  from '../../Spinner/Spinner';
import Alert    from '../../Alert/Alert';

import './ViewEvent.scss';

export default function ViewEvent({isLoading, event, hideTheBox, onBookingEvent, error}) {
    return (
        <>
            <Backdrop />
            <Model
                title="Event"
                btnTitle="Book"
                onCancle={hideTheBox}
                onConfirm={onBookingEvent}
            >
                {/* Spinner */}
                { isLoading ? 
                    <Spinner /> 
                    :
                    <div className="event">
                        <h1 className="event__detail--title">{event.title}</h1>
                        <p className="event__detail--poster">by {event.creator.email.split('@')[0]} - {new Date(event.date).toLocaleDateString()}</p>
                        <p className="event__detail--body">{event.description}</p>
                    </div>
                }
                {error && 
                    <Alert danger={error === 'danger'} 
                        success={error === 'success'}
                        message={error === 'success' ? 'Successfully Booked!' : 'Internal Error!'} />}
            </Model>
        </>
    )
}
