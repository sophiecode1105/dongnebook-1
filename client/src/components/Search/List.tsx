import styled from "styled-components";
import Booklist from "./BookList";

const Container = styled.section`
  padding: 0px 15px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
  height: 100vh;
`;

const BookListContainer = styled.div`
  border: 1px solid blue;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 300px;
  width: 80%;
  display: grid;
  grid-gap: 20px;
`;

const Div = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 100%;
`;

type BookInfo = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

const BookList = ({ allProductList }: { allProductList: BookInfo[] }) => {
  return (
    <Container>
      <BookListContainer>
        <Div>
          {allProductList.map((list, idx) => {
            return <Booklist key={idx} list={list} />;
          })}
        </Div>
      </BookListContainer>
    </Container>
  );
};

export default BookList;
