
const eventModel = require('../../models/event');
const userModel = require('../../models/users');
const bookingModel = require('../../models/booking');


const bcryptjs = require('bcryptjs');

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
           return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator) }
   })
    }
    catch(err) {
        throw err;
    };
}
module.exports= {
    events: async () =>{
        try{
        const events = await eventModel.find()
            return events.map(event => {
                return { ...event._doc, _id: event.id, creator: user.bind(this, event._doc.creator) } 
            })
        }
    
    catch(err) {
            throw err;
        };
    },
    
    bookings: async ()=>{
        try {
            const bookings = await bookingModel.find();
            return bookings.map(booking => {
              return {
                ...booking._doc,
                _id: booking.id,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString()
              };
            });
          } catch (err) {
            throw err;
          }
    },
  createEvent: async args => {
    const event = new eventModel({
      title: args.eventInp.title,
      description: args.eventInp.description,
      price: +args.eventInp.price,
      date: new Date(args.eventInp.date),
      creator: '5d47d75c97d0696c218aec72'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
      const creator = await userModel.findById('5d47d75c97d0696c218aec72');

      if (!creator) {
        throw new Error('User not found.');
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await userModel.findOne({ email: args.userInp.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInp.password, 12);

      const user = new userModel({
        email: args.userInp.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await bookingModel.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        creator: user.bind(this, booking.event._doc.creator)
      };
      await bookingModel.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    const fetchedEvent = await eventModel.findOne({ _id: args.eventId });
    const booking = new bookingModel({
      user: '5d47d75c97d0696c218aec72',
      event: fetchedEvent
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString()
    };
  }
};