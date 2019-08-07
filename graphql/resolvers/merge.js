
const eventModel = require('../../models/event');
const userModel = require('../../models/users');
const bookingModel = require('../../models/booking');
const { dateToString } = require('../../helpers/date')

const bcryptjs = require('bcryptjs');

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const singleEvent = async eventId => {
    try {
      const event = await eventModel.findById(eventId);
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event.creator)
      };
    } catch (err) {
      throw err;
    }
  };
const user = async userid =>{
    try{
    const res = await userModel.findById(userid)
        return { ...res._doc, _id: res.id, createdEvents: events.bind(this, res._doc.createdEvents) }
    }
    catch(err) {
        throw err;
    };
}


const events = async eventids =>{
    try{
        const res = await eventModel.find({_id: {$in: eventids}})
      return  res.map(event => {
           return transformEvent(event);
   })
    }
    catch(err) {
        throw err;
    };
}
const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;
