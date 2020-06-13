import React       from 'react';
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

class Events extends React.Component {


    
    // Sate Managing

    state = {
        allEvents: [],
        creating: false,
        isLoading: true,
        eventSelected: null,
        isBookLoading: false,
        bookingError: false,
        setTabURi: '/events'
    }
    // Context As State
    static contextType = AuthContext;

    componentDidMount() {
        this.fetchEvent();
    }

    // Fetching Data
    fetchEvent = () => {

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
            this.setState({
                allEvents: [...events],
                isLoading: false
            });
        })
        .catch(err => {
            console.log(err, 'Error on Fetching Events')
            this.setState({isLoading: false});
        })
        ;
    }

    // Creating Event Showing
    modelBoxHandler = () => {

        // works on when the ViewEvent is open
        if (this.state.eventSelected) 
        {
            this.setState({eventSelected: null});
            return;
        }

        this.setState(prevState => ({ creating: !prevState.creating}));
    }

    // Filtering My Event
    filterMyEvents = () => {
        if(!this.state.allEvents.length)
            return;
        const myEvents = this.state.allEvents.filter(event => event.creator.email === this.context.email);
        return myEvents;
    }

    // Showing the Event's detial Box
    onSelectedEvent = (id) => {
        this.setState({eventSelected:  id});
    }

    // Booking the Event
    bookingEventHandler = () => {
        this.setState({isLoading: true});

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
                id: this.state.eventSelected._id
            }
        }, this.context.token)
        .then(res => {
            this.setState({
                isBookLoading: false,
                bookingError: 'success',
            });
            setTimeout(() => {
                this.setState({
                    eventSelected: null,
                    bookingError: false
                });
            }, 1500);
        })
        .catch(err => {
            this.setState({
                isBookLoading: false,
                bookingError: 'danger'
            });
            throw err;
        });
        
    }

    render () {

        // Simplify
        const { allEvents,tabURi, creating, eventSelected, isBookLoading, bookingError, isLoading} = this.state;

        return (
            <div className="events">

                {/* New Event Creating */}
                { creating && 
                    <CreateEvent 
                        onHidder={this.modelBoxHandler}
                        allEvents={allEvents} /> 
                }

                {/** Event Creator Box */}
                { this.context.token && <EventCreator modelBoxHandler={this.modelBoxHandler} /> }

                {/** Tabs, Show only when User authenticated */}
                { this.context.token && <EventTab onChangeTab={this.setTabURi} />}

                {/* Show Event Details when clicked */}
                { eventSelected && 
                    <ViewEvent
                        isLoading={isBookLoading}
                        onBookingEvent={this.bookingEventHandler}
                        hideTheBox={this.modelBoxHandler}
                        event={eventSelected}
                        error={bookingError} /> 
                }


                <div className="events__list">
                    
                    { isLoading && <Spinner />}

                    {/** Show the Events List */}
                    { ( (!allEvents.length && this.state.setTabURi === '/events' ) || ( !this.filterMyEvents().length && this.state.setTabURi === '/myevents' )) && !isLoading ?
                        <div className="events__list-item">
                            <EmptyEvent />
                        </div>
                        : 
                        <EventList 
                            allEvents={this.state.setTabURi === '/events' ? allEvents : this.filterMyEvents()}
                            onSelectedEvent={this.onSelectedEvent} />
                    }

                    { console.log('Event Rendered.js =>') }

                </div>

            </div>
        )
    }
}



export default React.memo(Events, () => true);