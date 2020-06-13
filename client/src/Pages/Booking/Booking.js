import React     from 'react';
import Spinner   from '../../components/Spinner/Spinner';
import Sender    from '../../helper/sender-hel';
import AuthContext from '../../context/global-context';

import './Booking.scss';
import Button from '../../components/Button/Button';
import EmptyEvent from '../../components/Event/EmptyEvent/EmptyEvent';

export default function Booking() {

    // Context
    const { token } = React.useContext(AuthContext);

    // Booking Events
    const [bookings, setBookings] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [shouldRender, setShouldRender] = React.useState(true);

    React.useEffect(() => {
        fetchBookingEvents();
        
        // clean up
        return () => {
            setShouldRender(false)
        }
    },[]);

    // umount
    if(!shouldRender)
        return null;


    const fetchBookingEvents = () => {

        // Query 
        const query = `
            query {
                bookings {
                    _id
                    event {
                        title
                    }
                    createdAt
                    updatedAt
                }
            }
        `;

        // send it

        Sender({
            query: query
        }, token)
        .then(res => {
            setBookings([...res.data.data.bookings]);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            throw err;
        });
    }

    // Cancel Boooking
    const cancelBookingHandler = (bookId) => {

        // Query
        const query = `
            mutation cancelBooking($id: String! ) {
                cancelBooking(bookId: $id) {
                    _id
                }
            }
        `;

        // Send it
        Sender({
            query: query,
            variables: {
                id: bookId
            }
        }, token)
        .then(res => {
            setBookings(bookings.filter(book => book._id !== bookId));
        })
        .catch(err => {
            throw err;
        });
    }

    return (
        <div className="bookings">
            {isLoading && <Spinner />}

            {/* Show Bookings Events */}
            {  bookings.length !== 0 && bookings.map(book => (
                <div key={book._id} className="bookings__event">
                    <div className="bookings__event--content">
                        <h1 className="bookings__event--title">{book.event.title}</h1>
                        <p className="bookings__event--postby"> You Book this event on {new Date(book.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button title="Cancel" color onTrigger={cancelBookingHandler.bind(this, book._id)} />
                </div>
            ))  
            }
        
            {/* Empty Case */}
            { (bookings.length === 0 && !isLoading ) && <EmptyEvent />}

        </div>
    )
}
