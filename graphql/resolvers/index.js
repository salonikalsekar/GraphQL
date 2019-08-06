
const eventModel = require('../../models/event');
const userModel = require('../../models/users');


const bcryptjs = require('bcryptjs');
const user = userid =>{
    return userModel.findById(userid).then(res => {
        return { ...res._doc, _id: res.id, createdEvents: events.bind(this, res._doc.createdEvents) }
    }).catch(err => {
        throw err;
    })
}


const events = eventids =>{
    return eventModel.find({_id: {$in: eventids}}).then(res => {
        return res.map(event => {
            return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator) }
        })
    }).catch(err => {
        throw err;
    })
}
module.exports= {
    events: () =>{
        return eventModel.find().then(events => {
            return events.map(event => {
                return { ...event._doc, _id: event.id, creator: user.bind(this, event._doc.creator) } 
            })
        }).catch(err => {
            throw err;
        })
    },
    createEvent: args => {
        const event = new eventModel({
          title: args.eventInp.title,
          description: args.eventInp.description,
          price: +args.eventInp.price,
          date: new Date().toISOString(),
          creator: '5d47d75c97d0696c218aec72'
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString(), creator: user.bind(this, result._doc.creator) };
            return userModel.findById('5d47d75c97d0696c218aec72');
          })
          .then(user => {
            if (!user) {
              throw new Error('User not found.');
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },
    createUser: (args) =>{
       return userModel.findOne({email: args.userInp.email}).then(user => {
            if(user)
            throw new Error('User already present');
            return bcryptjs.hash(args.userInp.password, 12)
        })
        .then(hashed => {
            const user = new userModel({
                email: args.userInp.email,
                    password: hashed
            })
                    return user.save()
            }).then(res =>{
                return { ...res._doc, _id: res._doc._id.toString(), password: null} 
        }).catch(err => {
            throw err;
        })

    }
}