import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { bookSearch, loginState } from "../../state/state";

const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  padding-top: 70px;
  margin: 0 auto;
`;

const SelectBox = styled.select`
  width: 5.5rem;
  padding: 0.8em 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: black;
  font-weight: bold;
  &:focus {
    outline: none;
  }
`;

const Title = styled.h1`
  color: black;
  font-weight: bold;
  font-size: 23px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 12px;
`;

const SearchBox = styled.div`
  margin-top: 30px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SearchInput = styled.input`
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 60%;
  padding: 8px;
  &:focus {
    outline-color: green;
  }
`;
const SearchButton = styled.button`
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

const IconBox = styled.div`
  width: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px 0px 20px;
  i {
    font-size: 35px;
    &:hover {
      color: rgba(47, 98, 24);
    }
  }
`;

const SearchBar = ({ handleSearchClick, setChoice }: { handleSearchClick: any; setChoice: any }) => {
  const isLogin = useRecoilValue(loginState);
  const navigate = useNavigate();
  const search = useSetRecoilState(bookSearch);

  const lists = ["제목", "글쓴이", "내용"];
  const EngList = ["title", "nickname", "content"];

  const options = lists.map((list, i) => {
    return (
      <option key={i} value={EngList[i]}>
        {list}
      </option>
    );
  });

  const handleCheckLogin = () => {
    if (isLogin) {
      localStorage.setItem("whichmap", "등록");
      navigate("/upload");
    } else {
      navigate("/signin");
    }
  };

  const handleList = (e: any) => {
    setChoice(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSearchClick();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
  };

  return (
    <Container className="px-[10px]">
      <Title>도서 검색</Title>
      <SearchBox>
        <SelectBox onInput={handleList}>{options}</SelectBox>
        <SearchInput
          type="text"
          placeholder="찾고싶은 도서를 검색해보세요"
          onKeyPress={handleKeyPress}
          onChange={handleChange}
        ></SearchInput>
        <SearchButton type="button" onClick={handleSearchClick}>
          <i className="fas fa-search"></i>
        </SearchButton>
        <IconBox onClick={handleCheckLogin}>
          <i className="fas fa-plus-circle"></i>
        </IconBox>
      </SearchBox>
    </Container>
  );
};

export default SearchBar;
