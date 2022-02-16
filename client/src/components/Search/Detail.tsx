import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getSingleBookInfo, timeForToday } from "../../api";
import { BookInfo } from "../../state/typeDefs";
import avatar from "../../img/avatar.png";

const Container = styled.div`
  max-width: 1400px;
  height: 100vh;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 15px 0px 15px;
`;
const TitleBox = styled.div`
  width: 80%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const KeyInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 500px;
  margin: 30px;
`;

const BookImg = styled.img`
  width: 35%;
  height: 100%;
  object-fit: fill;
`;

const KeyInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  height: 100%;
`;

const BookTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20%;
  font-size: 25px;
  font-weight: bold;
  padding: 20px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 15%;
  padding: 20px;
`;

const UserInfoBox = styled.div`
  display: flex;
  width: 100%;
  padding: 20px;
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 20px;
`;
const UserNickname = styled.div`
  color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Heart = styled.div`
  color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 3px;
`;
const Watch = styled.div`
  color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 3px;
`;
const Date = styled.div`
  color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 3px;
`;
const Letter = styled.div`
  color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 3px;
`;

const Line = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 10px;
`;

const BorderBottom = styled.div`
  width: 95%;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
`;

const DetailInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 0px 0px 20px;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  justify-content: cetner;
  height: 30%;
  color: rgba(0, 0, 0, 0.7);
  width: 100%;
  padding: 20px 20px 0px 20px;
`;
const StatusBox = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Explanation = styled.li`
  width: 20%;
  color: rgba(0, 0, 0, 0.5);
`;

const DetailContent = styled.div`
  color: rgba(0, 0, 0, 0.8);
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: cetner;
  width: 100%;
`;

const HeartButton = styled.button`
  width: 10%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  i {
    color: red;
    font-size: 20px;
  }
`;
const StatusButton = styled.button`
  width: 35%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  color: rgb(242, 242, 242, 0.9);
  background-color: #b2b0b0;
`;

const TouchButton = styled.button`
  width: 35%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;

const Details = () => {
  let { id } = useParams();

  const [bookDetailInfo, setBookDetailInfo] = useState<BookInfo | {}>({});
  const [isPressed, setIsPressed] = useState(false);

  const { title, img, content, quality, exchanged, createdAt, locations } = bookDetailInfo as BookInfo;

  const date = timeForToday(createdAt);

  const getSingleData = async () => {
    const data = await getSingleBookInfo(Number(id));
    setBookDetailInfo(data);
  };

  const handleClickHeart = () => {
    setIsPressed(!isPressed);
  };
  const handleChangePage = () => {};
  useEffect(() => {
    getSingleData();
  }, []);

  return (
    <Container>
      <TitleBox>
        <Title>상세보기</Title>
      </TitleBox>
      <KeyInfoBox>
        <BookImg src={img} />
        <KeyInfo>
          <BookTitle>{title}</BookTitle>
          <BorderBottom />
          <UserInfoBox>
            <UserAvatar src={avatar} />
            <UserNickname>이채야채</UserNickname>
          </UserInfoBox>
          <IconBox>
            <Heart>
              <i className="fas fa-heart"></i>
            </Heart>
            <Line> </Line>
            <Watch>
              <i className="fas fa-eye"></i>
            </Watch>
            <Line> </Line>
            <Date>
              <i className="fas fa-clock"></i>
            </Date>
            <Line> </Line>
            <Letter>{date}</Letter>
          </IconBox>
          <DetailInfoBox>
            <StatusBox>
              <Explanation>상품상태</Explanation>
              <DetailContent>{quality}</DetailContent>
            </StatusBox>
            <StatusBox>
              <Explanation>거래지역</Explanation>
              <DetailContent>{locations?.address}</DetailContent>
            </StatusBox>
          </DetailInfoBox>
          <Content>{content}</Content>
          <ButtonBox>
            <HeartButton onClick={handleClickHeart}>
              {isPressed ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
            </HeartButton>
            <StatusButton>거래가능</StatusButton>
            <TouchButton onClick={handleChangePage}>연락하기</TouchButton>
          </ButtonBox>
        </KeyInfo>
      </KeyInfoBox>
    </Container>
  );
};

export default Details;
