import styled from "styled-components";
import { BookInfo, LikeList } from "../../state/typeDefs";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Container = styled.section`
  padding: 0px 15px;
  width: 85%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  padding-top: 30px;
  height: 100vh;
`;

const SelectionBox = styled.div`
  display: felx;
`;
type borderProps = {
  border: boolean;
};

const Exchangeable = styled.div<borderProps>`
  margin-right: 10px;
  font-size: 20px;
  border-bottom: ${(props) => (props.border ? "2px solid green" : "null")};
`;

const UnExchangeable = styled.div<borderProps>`
  margin-right: 10px;
  font-size: 20px;
  border-bottom: ${(props) => (props.border ? "2px solid green" : "null")};
`;

const Likes = styled.div<borderProps>`
  font-size: 20px;
  border-bottom: ${(props) => (props.border ? "2px solid green" : "null")};
`;

const BookListContainer = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 330px;
  width: 100%;
  height: 100%;
  display: grid;
  padding-left: 30px;
  grid-gap: 20px;
  margin-top: 10px;
  border: 1px solid red;
`;

const Wrap = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0px 0px 20px 0px;
  margin-bottom: 10px;
`;

const BookImgBox = styled.div`
  width: 100%;
  height: 80%;
`;

const BookImg = styled.img`
  width: 100%;
  height: 100%;
  margin: auto;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 19px;
  height: 10%;
  margin: 5px 5px 0px 5px;
`;
const Location = styled.div`
  height: 10%;
  font-size: 15px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.6);
`;

const MyList = ({
  exchangeableList,
  unExchangeableList,
  likesList,
}: {
  exchangeableList: BookInfo[];
  unExchangeableList: BookInfo[];
  likesList: LikeList[];
}) => {
  const [onClickExchangeable, setOnClickExchangenable] = useState(false);
  const [onClickUnExchangeable, setOnClickUnExchangenable] = useState(false);
  const [onClickLike, setOnClickLike] = useState(false);
  const [dataList, setDataList] = useState<any>();

  useEffect(() => {
    setDataList(exchangeableList);
  }, [exchangeableList]);

  console.log("아니 왜 이런 시련을", dataList);

  return (
    <Container>
      <SelectionBox>
        <Exchangeable
          border={onClickExchangeable}
          onClick={() => {
            setOnClickExchangenable(true);
            setOnClickUnExchangenable(false);
            setOnClickLike(false);
          }}
        >
          게시글
        </Exchangeable>
        <UnExchangeable
          border={onClickUnExchangeable}
          onClick={() => {
            setOnClickExchangenable(false);
            setOnClickUnExchangenable(true);
            setOnClickLike(false);
          }}
        >
          교환내역
        </UnExchangeable>
        <Likes
          border={onClickLike}
          onClick={() => {
            setOnClickExchangenable(false);
            setOnClickUnExchangenable(false);
            setOnClickLike(true);
          }}
        >
          관심목록
        </Likes>
      </SelectionBox>
      <BookListContainer>
        {dataList?.map((list: any, idx: any) => {
          return (
            <Wrap to={`/search/${list.id}`}>
              <BookImgBox>
                <BookImg src={list.images[0]?.url} />
                <Title>{list.title}</Title>
                <Location>{list?.locations?.address}</Location>
              </BookImgBox>
            </Wrap>
          );
        })}
      </BookListContainer>
    </Container>
  );
};
export default MyList;
