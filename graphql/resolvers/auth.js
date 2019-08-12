
const userModel = require('../../models/users');
const { dateToString } = require('../../helpers/date')
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

module.exports= {
  createUser: async args => {
    console.log("d")
    try {
      console.log("user")
      const existingUser = await userModel.findOne({ email: args.userInp.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcryptjs.hash(args.userInp.password, 12);

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
  login: async({email, password}) => {
    const user = await userModel.findOne({email:email});
    if(!user){
      throw new Error("No such user");
      
    }
    const isEqual = await bcryptjs.compare(password , user.password);
    if(!isEqual)
    throw new Error("Password is Incorrect")
    const token = jwt.sign({userId: user.id, email: user.email}, 'secretkey', {expiresIn: '1h'});
    return { userId: user.id, token: token, tokenExpiration: 1 }
  }
};
