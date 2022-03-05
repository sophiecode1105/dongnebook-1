import List from "../components/Search/List";
import { useState } from "react";
import SearchBar from "../components/Search/Searchbar";
import { useRecoilValue } from "recoil";
import { getBookList, searchBook } from "../api";
import { useEffect } from "react";
import { BookInfo } from "../state/typeDefs";
import { bookSearch } from "../state/state";

const HTML: any = document.querySelector("html");
export let pages: number;
let page: number = 1;

const Search = () => {
  const [allProductList, setAllProductList] = useState<BookInfo[]>([]);
  const searchText = useRecoilValue(bookSearch);
  const [change, setChange] = useState(1);
  const [loading, setLoading] = useState(false);
  const [choice, setChoice] = useState("title");

  const getData = async (change: number) => {
    const { allProductList: bookList, pages: pagesNumber } = await getBookList(change);
    setAllProductList((prev) => [...prev, ...bookList]);
    pages = pagesNumber;
  };

  const handleSearchClick = async () => {
    const { result: data } = await searchBook(choice, searchText);
    setAllProductList(data);
  };

  const infiniteScroll = () => {
    const currentScrollTop = HTML?.scrollTop; // 현재 스크롤 위치
    const windowInner = window.innerHeight; // 브라우저의 스크롤 높이
    const fullHeight = HTML?.scrollHeight; // HTML의 높이
    if (currentScrollTop + windowInner > fullHeight) {
      if (pages > page) {
        page++;
        setChange((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getData(change);
    setLoading(false);
  }, [change]);

  useEffect(() => {
    window.addEventListener("scroll", infiniteScroll);
    return () => {
      window.removeEventListener("scroll", infiniteScroll);
      page = 1;
    };
  }, []);

  return (
    <div>
      <SearchBar setChoice={setChoice} handleSearchClick={handleSearchClick} />
      <List allProductList={allProductList} loading={loading} change={change} />
    </div>
  );
};
export default Search;
