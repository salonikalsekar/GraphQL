const { dateToString } = require('../../helpers/date')
const bookingModel = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge')
const eventModel = require('../../models/event');

module.exports= {
   
    bookings: async ()=>{
        try {
            const bookings = await bookingModel.find();
            return bookings.map(booking => {
              return transformBooking(booking);
            });
          } catch (err) {
            throw err;
          }
    },
  cancelBooking: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    }
    try {
      const booking = await bookingModel.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await bookingModel.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    }
    const fetchedEvent = await eventModel.findOne({ _id: args.eventId });
    const booking = new bookingModel({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();
    return transformBooking(result);
  }
};
