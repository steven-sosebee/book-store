import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";
// import { getMe, deleteBook } from "../utils/API";
import AuthService from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});
  const user = AuthService.getProfile();
  // console.log(user);
  const [removeBook] = useMutation(REMOVE_BOOK);
  const { loading, data } = useQuery(QUERY_ME, {
    variables: {},
  });
  // console.log(useQuery(QUERY_ME, { variables: {} }));

  // console.log(userData.data);
  // console.log(userData.loading);

  // console.log(loading);
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       console.log("Getting Data...");
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;
  //       console.log(token);
  //       if (!token) {
  //         return false;
  //       }
  //       console.log(dataMe);
  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error("something went wrong!");
  //       }
  //       console.log(userData);
  //       const user = await response.json();
  //       setUserData(dataMe);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = AuthService.loggedIn() ? AuthService.getToken() : null;
    console.log("Removing book...");
    console.log(token);
    if (!token) {
      console.log("Errored out...");
      return false;
    }

    try {
      console.log("Calling remove book...");
      // const response = await deleteBook(bookId, token);

      // if (!response.ok) {
      //   throw new Error("something went wrong!");
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      console.log(`Removing book ${bookId}`);
      const deletedBook = await removeBook(bookId);

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  // if (isLoading) {
  //   return <h2>LOADING...</h2>;
  // }
  if (loading) {
    return <div>Loading...</div>;
  } else {
    console.log(data);
    return (
      <>
        <Jumbotron fluid className="text-light bg-dark">
          <Container>
            <h1>Viewing saved books!</h1>
          </Container>
        </Jumbotron>
        <Container>
          <h2>
            {data.me.savedBooks.length
              ? `Viewing ${data.me.savedBooks.length} saved ${
                  data.me.savedBooks.length === 1 ? "book" : "books"
                }:`
              : "You have no saved books!"}
          </h2>
          <CardColumns>
            {data.me.savedBooks.map((book) => {
              return (
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>
        </Container>
      </>
    );
  }
};

export default SavedBooks;
