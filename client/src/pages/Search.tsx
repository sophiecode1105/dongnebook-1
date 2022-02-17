import List from "../components/Search/List";
import { useState } from "react";
import SearchBar from "../components/Search/Searchbar";
import { useRecoilValue } from "recoil";
import axios from "axios";
import { getBookList, searchBook } from "../api";
import { useEffect } from "react";
import { BookInfo } from "../state/typeDefs";
import { bookSearch } from "../state/state";

const Search = () => {
  const [allProducList, setAllProductList] = useState<BookInfo[]>([]);
  const searchText = useRecoilValue(bookSearch);

  const getData = async () => {
    const bookList = await getBookList();
    setAllProductList(bookList);
  };

  const handleSearchClick = async () => {
    console.log(searchText);
    const data = await searchBook("title", searchText);
    console.log("데이터안온", data);
    setAllProductList(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <SearchBar handleSearchClick={handleSearchClick} />
      <List allProductList={allProducList} />
    </>
  );
};
export default Search;
