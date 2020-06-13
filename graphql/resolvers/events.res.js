const Event = require('../../models/event.model');
const User  = require('../../models/user.model');
const { transformedEvent } = require('./merge.helper');

module.exports = {
    createEvent: async (args, req) => {

        // Authorize only Logged in user
        if( !req.isAuth )
            throw new Error('Unauthenticated');
        
        // simplify
        const { title, description, date, price } = args.event;

        try {

            // Create new event obj
            const event = new Event({
                title,
                description,
                date,
                price,
                creator: req.userId
            });

            // Save
            const result = await event.save();result

            // Add event to User 
            const user = await User.findById(req.userId);
            
            user.createdEvents.push(result)
            await user.save();
            return transformedEvent(result);
        }
        catch(err) {
            console.error('Something went wrong on creating event!');
        }
    },

    // Getting Events
    events: async (args, req) => {

        try {
            const events = await Event.find();
            return events.map(event => {
                return transformedEvent(event);
            });
        }
        catch(err) {
            throw new Error(err, 'Something went wrong while getting Events!');
        }
    }
}