import styled from "styled-components";

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
  border: 1px solid red;
  background-color: yellow;
  width: 100%;
`;

const Content = styled.div`
  background-color: white;
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
          <Content>내용써보셈</Content>
        </Div>
        <Div></Div>
        <Div></Div>
        <Div></Div>
      </BookListContainer>
    </Container>
  );
};

export default BookList;
