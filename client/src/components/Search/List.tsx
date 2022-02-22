import { useEffect } from "react";
import styled from "styled-components";
import { BookInfo } from "../../state/typeDefs";
import Booklist from "./BookList";

const Container = styled.section`
  padding: 0px 15px;
  width: 85%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
  height: 100vh;
`;

const BookListContainer = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 330px;
  width: 100%;
  display: grid;
  padding-left: 30px;
  grid-gap: 20px;
`;

const BookList = ({ allProductList }: { allProductList: BookInfo[] }) => {
  useEffect(() => {}, [allProductList]);
  return (
    <Container>
      <BookListContainer>
        {allProductList.map((list, idx) => {
          return <Booklist key={idx} list={list} />;
        })}
      </BookListContainer>
    </Container>
  );
};

export default BookList;
