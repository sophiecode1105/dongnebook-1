import List from "../components/Search/List";
import { useState } from "react";
import SearchBar from "../components/Search/Searchbar";
import { useRecoilValue } from "recoil";
import { getBookList, searchBook } from "../api";
import { useEffect } from "react";
import { BookInfo } from "../state/typeDefs";
import { bookSearch } from "../state/state";

const Search = () => {
  const [allProductList, setAllProductList] = useState<BookInfo[]>([]);
  const searchText = useRecoilValue(bookSearch);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getData = async (page: number) => {
    const bookList = await getBookList(page);
    setAllProductList((prev) => [...prev, ...bookList]);
  };

  const handleSearchClick = async () => {
    const data = await searchBook("title", searchText);
    setAllProductList(data);
  };

  const infiniteScroll = () => {
    const HTML: any = document.querySelector("html");
    const elementScrollTop = HTML?.scrollTop; // 현재 스크롤 위치
    const windowInner = window.innerHeight; // 브라우저의 스크롤 높이
    const fullHeight = HTML?.scrollHeight; // HTML의 높이
    if (elementScrollTop + windowInner >= fullHeight) {
      console.log("이때다");
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    console.log(page);
    setLoading(true);
    getData(page);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", infiniteScroll);
    return () => window.removeEventListener("scroll", infiniteScroll);
  }, []);

  return (
    <div>
      <SearchBar handleSearchClick={handleSearchClick} />
      <List allProductList={allProductList} loading={loading} />
    </div>
  );
};
export default Search;
