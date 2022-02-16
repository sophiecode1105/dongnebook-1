import List from "../components/Search/List";
import { useState } from "react";
import SearchBar from "../components/Search/Searchbar";
import axios from "axios";
import { getBookList } from "../api";
import { useEffect } from "react";
import { BookInfo } from "../state/typeDefs";

const Search = () => {
  const [allProducList, setAllProductList] = useState<BookInfo[]>([]);

  const getData = async () => {
    const bookList = await getBookList();
    setAllProductList(bookList);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <SearchBar />
      <List allProductList={allProducList} />
    </>
  );
};
export default Search;
