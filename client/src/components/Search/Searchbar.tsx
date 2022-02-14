import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  width: 100%;
  padding-top: 100px;
  max-width: 1200px;
  position: relative;
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SearchInput = styled.input`
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* border-radius: 10px; */
  width: 60%;
  padding: 8px;
  &:focus {
    outline-color: green;
    /* border-bottom: 2px solid rgba(0, 0, 0, 0.2); */
  }
`;
const SearchButton = styled.button`
  /* height: 40px; */
  cursor: pointer;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
  font-size: 15px;
  transition: 0.3s;
  padding: 0 15px;
  i {
    color: white;
    font-size: 18px;
  }
`;

const SearchBar = () => {
  return (
    <Container>
      <SearchBox>
        <SearchInput type="text" placeholder="찾고싶은 도서를 검색해보세요"></SearchInput>
        <SearchButton type="button">
          <i className="fas fa-search"></i>
        </SearchButton>
      </SearchBox>
    </Container>
  );
};

export default SearchBar;
