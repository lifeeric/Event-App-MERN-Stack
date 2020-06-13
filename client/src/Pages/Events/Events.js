import React, { useCallback, useMemo }  from 'react';
import AuthContext from '../../context/global-context';
import CreateEvent from '../../components/Event/CreateEvent/CreateEvent';
import Sender      from '../../helper/sender-hel';
import Spinner     from '../../components/Spinner/Spinner';
import EmptyEvent  from '../../components/Event/EmptyEvent/EmptyEvent';
import ViewEvent   from '../../components/Event/ViewEvent/ViewEvent';
import EventTab    from '../../components/Event/EventTab/EventTab';
import EventCreator from '../../components/Event/EventCreater/EventCreator';
import EventList from '../../components/Event/EventList/EventList';

import './Events.scss';


function Events({location}) {
    // matching URL to Show my Events
    const [tabURi, setTabURi] = React.useState(location.pathname);

    
    // Sate Managing
    const [allEvents, setAllEvents]   = React.useState([]);
    const [creating, setCreating]     = React.useState(false);
    const [isLoading, setLoading]     = React.useState(true);
    const [eventSelected, setEventSelected]= React.useState(null);
    const [isBookLoading, setIsBookLoading]= React.useState(false);
    const [bookingError, setBookingError]  = React.useState(false);
    // Context As State
    const {token, email} = React.useContext(AuthContext);


    React.useEffect(() => {
        fetchEvent();
    }, []);

    // Fetching Data
    const fetchEvent = () => {

        const query = `
            query {
                events {
                    _id
                    title
                    price
                    description
                    date
                    creator {
                        email
                    }
                }
            }
        `;

        // Send Data
        Sender({
            query: query,
        }, '')
        .then(res => {
            const events = res.data.data.events;
            setAllEvents([...events]);
            setLoading(false);
        })
        .catch(err => {
            console.log(err, 'Error on Fetching Events')
            setLoading(true);
        })
        ;
    }

    // Creating Event Showing
    const modelBoxHandler = useCallback(() => {

        // works on when the ViewEvent is open
        if (eventSelected) 
        {
            setEventSelected(null);
            return;
        }

        setCreating(creating => !creating);
    }, [eventSelected]);

    // Filtering My Event
    const filterMyEvents = useMemo(() => {
        const myEvents = allEvents.filter(event => event.creator.email === email);
        return myEvents;
    },[allEvents])

    // Showing the Event's detial Box
    const onSelectedEvent = (id) => {
        setEventSelected(id);
    }

    // Booking the Event
    const bookingEventHandler = () => {
        setIsBookLoading(true);

        // Query
        const query = `
            mutation bookEvent($id: String!) {
                bookEvent(bookId: $id) {
                    _id
                }
            }
        `;

        // Dait it
        Sender({
            query: query,
            variables: {
                id: eventSelected._id
            }
        }, token)
        .then(res => {
            setIsBookLoading(false);
            setBookingError('success');
            setTimeout(() => {
                setEventSelected(null)
                setBookingError(false);
            }, 1500);
        })
        .catch(err => {
            setIsBookLoading(false)
            setBookingError('danger');
            throw err;
        });
        
    }

    return (
        <div className="events">

            {/* New Event Creating */}
                <CreateEvent
                    creating={creating} 
                    onHidder={modelBoxHandler}
                    allEvents={allEvents}
                    setEvents={setAllEvents} /> 

            {/** Event Creator Box */}
            { token && <EventCreator modelBoxHandler={modelBoxHandler} /> }

            {/** Tabs, Show only when User authenticated */}
            { token && <EventTab onChangeTab={setTabURi} />}

            {/* Show Event Details when clicked */}
            { eventSelected && 
                <ViewEvent
                    isLoading={isBookLoading}
                    onBookingEvent={bookingEventHandler}
                    hideTheBox={modelBoxHandler}
                    event={eventSelected}
                    error={bookingError} /> 
            }


            <div className="events__list">
                
                { isLoading && <Spinner />}

                {/** Show the Events List */}
                { ( (!allEvents.length && tabURi === '/events' ) || ( !filterMyEvents.length && tabURi === '/myevents' )) && !isLoading ?
                    <div className="events__list-item">
                        <EmptyEvent />
                    </div>
                    : 
                    <EventList 
                        allEvents={tabURi === '/events' ? allEvents : filterMyEvents}
                        onSelectedEvent={onSelectedEvent} />
                }    

            </div>

        </div>
    )
}



export default Events;