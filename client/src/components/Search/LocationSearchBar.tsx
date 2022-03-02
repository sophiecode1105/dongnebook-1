import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { bookSearch, loginState, searchData } from "../../state/state";
import { useEffect, useState } from "react";

const Container = styled.div``;

const SearchBox = styled.form`
  margin-bottom: 15px;
  display: flex;
  width: 100%;
  justify-content: center;
`;

const SearchInput = styled.input`
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 80%;
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
const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 15px;
  position: relative;
`;
const SearchList = styled.div`
  z-index: 60;
`;

const LocationSearchBar = ({ keywords, searchPlaces, moveLocation }: any) => {
  const [searchList, setSearchList] = useRecoilState(searchData);
  function sideClick(e: any) {
    if (e.target.classList[2] !== "side") {
      setSearchList([]);
    }
  }
  useEffect(() => {
    window.addEventListener("click", sideClick);
    return () => {
      window.removeEventListener("click", sideClick);
    };
  }, []);
  return (
    <Container>
      <SearchBox
        onSubmit={(e) => {
          e.preventDefault();
          moveLocation();
        }}
      >
        <SearchInput
          ref={keywords}
          onChange={() => {
            searchPlaces();
          }}
          type="text"
          placeholder="찾고싶은 도서를 검색해보세요"
        ></SearchInput>
        <SearchButton
          onClick={() => {
            moveLocation();
          }}
          type="button"
        >
          <i className="fas fa-search"></i>
        </SearchButton>
      </SearchBox>
      <ListBox>
        {searchList.map((el: any, idx: number) => {
          return (
            <SearchList
              className="side"
              key={idx}
              onClick={(e) => {
                moveLocation(el.place_name);
              }}
            >
              {el.place_name}
            </SearchList>
          );
        })}
      </ListBox>
    </Container>
  );
};

export default LocationSearchBar;
