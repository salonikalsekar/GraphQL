const { dateToString } = require('../../helpers/date')
const eventModel = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge')
const userModel = require('../../models/users');

module.exports= {
    
    events: async () =>{
        try{
        const events = await eventModel.find()
            return events.map(event => {
                return transformEvent(event) 
            })
        }
    
    catch(err) {
            throw err;
        };
    },
  createEvent: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Unauthorized')
    }
    const event = new eventModel({
      title: args.eventInp.title,
      description: args.eventInp.description,
      price: +args.eventInp.price,
      date: dateToString(args.eventInp.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await userModel.findById(req.userId);

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
  }
 
};

