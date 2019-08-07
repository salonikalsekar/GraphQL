
const userModel = require('../../models/users');
const { dateToString } = require('../../helpers/date')

const bcryptjs = require('bcryptjs');

module.exports= {
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
  }
};
