const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // console.log(context.headers.token);
      // console.log(args);
      // console.log(context.user);
      // console.log("____________");
      if (context.user) {
        const data = await User.findOne({ _id: context.user._id });
        // console.log(data);
        return data;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  Mutation: {
    // login: async (parent, { username, password }) => {
    //   const user = await User.findOne({ username });

    //   if (!user) {
    //     throw new AuthenticationError("No user found with this username");
    //   }

    //   const correctPw = await User.checkPassword(password);

    //   if (!correctPw) {
    //     throw new AuthenticationError("Incorrect credentials");
    //   }

    //   const token = signToken(user);

    //   return { token, user };
    // },
    addUser: async (parent, { username, email, password }, context) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this username");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (
      parent,
      { authors, bookId, image, link, title, description },
      context
    ) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { authors, bookId, image, link, title, description },
            },
          },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new AuthenticationError("Error in adding book...");
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } }
          // { new: true }
        );
        console.log(updatedUser);
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new AuthenticationError("Couldn't remove book...");
      }
    },
  },
};

module.exports = resolvers;
