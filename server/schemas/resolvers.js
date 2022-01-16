const { Tech, Matchup } = require("../models");
const { User } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, { _id }) => {
      return User.findById(_id);
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      return Auth;
    },
  },
};

module.exports = resolvers;
