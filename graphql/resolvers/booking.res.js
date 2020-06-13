const Booking = require('../../models/book.model');
const Event   = require('../../models/event.model');
const { transformedBooking } = require('./merge.helper');

module.exports = {

    bookings: async (args, req) => {

        // Validate
        if( !req.isAuth )
            throw new Error('Unauthenticated');

        try {
            const fetchedBookings = await Booking.find({user: req.userId});
            return fetchedBookings.map(book => {
                return transformedBooking(book);
            });
        }
        catch(err) {
            throw new Error(err, ' Something went wrong while Gettng booking');
        }
    },

    /** Book Event */
    bookEvent: async (args, req) => {

        // Validate
        if( !req.isAuth )
            throw new Error('Unauthenticated');

        try {

            // Find the Event
            const event = await Event.findOne({_id: args.bookId});
            // Book now
            const booking = new Booking({
                user: req.userId,
                event: event,
            });

            const result = await booking.save();
            return transformedBooking(result);
        }
        catch(err) {
            throw new Error(err, ' Something went wrong while booking!');
        }
    },

    /** Cancel Book */
    cancelBooking: async (args, req) => {

        // Validate
        if( !req.isAuth )
            throw new Error('Unauthenticated');

        try {
            //const booking = await Booking.findById(args.bookId);

            // Delete 
            const deleted = await Booking.findByIdAndDelete(args.bookId);
            console.log(deleted)
            return deleted;
        }
        catch(err) {
            throw new Error(err, ' Something went wrong while cancelling booking!');
        }
    }
}