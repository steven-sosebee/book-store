const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return Users.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("No user found with this username");
      }

      const correctPw = await User.checkPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("No user found with this username");
      }

      const correctPw = await User.isPasswordCorrect(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { authors, bookId, image, link }, context) => {
      try {
        let updateUser;
        const userBooks = await Users.findOne({
          _id: context.user_ID,
        });
        console.log(context);
        // console.log(userRating);
        const alreadyAdded = userBooks.savedBooks.find(
          (book) => book.bookId === bookId
        );
        console.log(alreadyAdded);
        if (alreadyAdded) {
          return userBooks;
        } else {
          updateUser = await Users.findOneAndUpdate(
            { _id: context._ID },
            { $addToSet: { savedBooks: { authors, bookId, image, link } } },
            { new: true, runValidators: true }
          );
        }
        return updateUser;
      } catch (err) {
        console.log(err);
      }
      throw new AuthenticationError("Error in addRating...");
    },
  },
};

module.exports = resolvers;
