const { dateToString } = require('../../helpers/date')
const eventModel = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge')

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
  createEvent: async args => {
    const event = new eventModel({
      title: args.eventInp.title,
      description: args.eventInp.description,
      price: +args.eventInp.price,
      date: dateToString(args.eventInp.date),
      creator: '5d47d75c97d0696c218aec72'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
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
  }
 
};

