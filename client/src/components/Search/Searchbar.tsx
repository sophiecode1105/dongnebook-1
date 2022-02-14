import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: center;
  width: 100%;
  padding-top: 100px;
  max-width: 1200px;
  border: 1px solid red;
`;

const SearchInput = styled.input`
  width: 60%;
  border: 2px solid green;
  padding: 10px;
  border-radius: 30px;
`;

const SearchBar = () => {
  return (
    <Container>
      <SearchInput></SearchInput>
    </Container>
  );
};

export default SearchBar;
