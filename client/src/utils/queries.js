import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      username
    email
    bookCount
    savedBooks{}
    }
  }
`;
