const auth   = require('./auth.res');
const events = require('./events.res');
const booking= require('./booking.res');

module.exports = {
    ...auth,
    ...events,
    ...booking
}