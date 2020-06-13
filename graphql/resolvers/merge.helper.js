const User     = require('../../models/user.model');
const Event    = require('../../models/event.model');
const { Date } = require('../../helper/date.helper');
const DataLoader= require('dataloader');

/** User Dataloader */

const batchUser = new DataLoader(async (userId) => {
        const rows = await User.find({_id: {$in: userId}});
        
        // Make object key/value
        const lookup = rows.reduce((acc, row) => {
                acc[row._id] = {...row._doc, password: null};
                return acc;
        }, {});

        return userId.map(id => lookup[id] || null);
});


/** Getting User Data, No longer using this code, navie version N+1 */
const user = async userId => {
        
        try {
                const fetchedUser = await User.findById(userId);
                console.log('User fired');
                return {
                        ...fetchedUser._doc,
                        password: null,
                        createdEvents: event.bind(this, fetchedUser.createdEvents)
                };
        }
        catch(err) {
                throw new Error(err, 'Something went wrong while geting User!');
        };
}

/** Getting Event Data N+1, navie version*/
const event = async (eventId) => {

        try {
                const fetchedEvents = await Event.find({_id: {$in: eventId}});

                return fetchedEvents.map(event => {
                        return transformEvent(event)
                });
        }
        catch(err) {
                throw new Error(err, 'Something went wrong while getting Event!');
        }
}

/** Single Event */
const singleEvent = async (eventId) => {
        console.log(eventId, ' Single')
        try {
                const event = await Event.findOne({_id: eventId});

                return transformEvent(event);
        }
        catch(err) {
                throw new Error(err, 'Something went wrong while getting single Event!');
        }
}

/** Event Transforming */
const transformEvent = (event) => {

        return {
                ...event._doc,
                date: Date(event.date),
                updatedAt: Date(event.updatedAt),
                createdAt: Date(event.createdAt),
                creator: batchUser.load(event.creator)
        }
}

/** Booking Transforming */
const transformBooking = async (book) => {
        return {
                ...book._doc,
                user: batchUser.load(book.user),
                event: singleEvent.bind(this, book.event),
                createdAt: Date(book.createdAt)
        }
}

exports.transformedEvent  = transformEvent;
exports.transformedBooking= transformBooking;