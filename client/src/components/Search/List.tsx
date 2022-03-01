import styled from "styled-components";
import { pages } from "../../pages/Search";
import { BookInfo } from "../../state/typeDefs";
import Loading from "../Loading";
import Booklist from "./BookList";

const Container = styled.section`
  padding: 0px 15px;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
  flex-direction: column;
  align-items: center;
`;

const BookListContainer = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 330px;
  width: 100%;
  display: grid;
  grid-gap: 20px;
`;

const BookList = ({
  allProductList,
  loading,
  change,
}: {
  allProductList: BookInfo[];
  loading: boolean;
  change: number;
}) => {
  return (
    <Container>
      <BookListContainer>
        {allProductList.map((list, idx) => {
          return <Booklist key={idx} list={list} />;
        })}
      </BookListContainer>
      {loading && <Loading />}
      {change === pages && <div className="w-full h-60 flex justify-center items-center">마지막 페이지 입니다.</div>}
    </Container>
  );
};

export default BookList;
