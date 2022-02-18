import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { deleteContent, getSingleBookInfo, patchExchange, postHeart, timeForToday } from "../../api";
import { BookInfo, isWriterProps, UserState } from "../../state/typeDefs";
import { useMediaQuery } from "react-responsive";
import avatar from "../../img/avatar.png";
import MobileDetail from "./MobileDetail";
import { loginState, userState } from "../../state/state";
import { useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import axios from "axios";

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
  width: 1100px;
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
  width: 1100px;
  height: 550px;
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
  height: 150px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
`;

const UserBox = styled.div`
  display: flex;
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
  align-items: center;
  width: 120px;
  margin-right: 20px;
`;

const UserModifyBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 300px;
  padding: 10px;
`;

const BookStatusBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 70%;
`;

const BookStatusTitle = styled.div`
  width: 100%;
  height: 50%;
  font-size: 17px;
  font-weight: bold;
  padding: 5px;
`;
const BookStatusChangeBox = styled.div`
  width: 100%;
  height: 50%;
  /* border: 1px solid black; */
`;

const BooksStatusChange = styled.div`
  width: 100%;
  height: 50%;
  padding: 5px;
  font-size: 16px;
  font-weight: bold;
`;

const StatusCheck = styled.div`
  height: 50%;
  padding: 5px;
  font-size: 10px;
`;

const Checklabel = styled.label`
  margin-right: 10px;
  font-size: 15px;
`;

const CheckList = styled.input`
  margin-right: 7px;
`;

const ModifyButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 100%;
`;
const ModifyButton = styled.div`
  text-align: center;
  width: 80%;
  height: 100%;
  cursor: pointer;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
`;

const IconProps = styled.div`
  color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 3px;
`;

const Heart = styled(IconProps)``;
const Watch = styled(IconProps)``;
const Date = styled(IconProps)``;
const Letter = styled(IconProps)``;

const Line = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  height: 10px;
`;

const BorderBottom = styled.div`
  width: 95%;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
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
  height: 300px;
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
  width: 12%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 500;
  color: rgb(242, 242, 242, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* &:hover {
    background-color: rgba(178, 176, 176, 0.8);
  } */
  i {
    color: red;
    font-size: 20px;
  }
`;

const TouchButton = styled.button<isWriterProps>`
  width: ${(props) => (props.isWriter ? "95%" : "65%")};
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
const Div = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Details = () => {
  let { id } = useParams();

  const [bookDetailInfo, setBookDetailInfo] = useState<BookInfo | {}>({});
  const [isHeartPressed, setIsHeartPressed] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [userData, setUserData] = useState<UserState>(useRecoilValue(userState));
  const UserCheck = useRecoilValue(userState);
  const token = useRecoilValue(loginState);

  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);
  const { title, images, content, quality, exchanged, createdAt, locations, nickname } = bookDetailInfo as BookInfo;
  // console.log("이미지", images[0]);
  const date = timeForToday(createdAt);
  const navigate = useNavigate();
  const isWriter = UserCheck?.nickname === nickname;
  console.log(isWriter);

  const getSingleData = async () => {
    const data = await getSingleBookInfo(Number(id));
    setBookDetailInfo(data);
  };

  const handleClickHeart = async () => {
    setIsHeartPressed(!isHeartPressed);
    try {
      await postHeart(Number(id), token);
    } catch (e) {
      console.error(e);
    }
  };
  const handleChangePage = () => {
    navigate("/myinfo");
  };

  const handleClickDelete = async () => {
    await deleteContent(Number(id));
    navigate("/search");
  };

  const handleClickExchange = async (e: any) => {
    await patchExchange(Number(id));
    setIsSold(true);
    Swal.fire({
      text: "교환완료로 변경되었습니다.",
      confirmButtonText: "확인",
      confirmButtonColor: "#2f6218",
      icon: "success",
    });
  };

  //테스트용!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const bookLiked = async () => {
    console.log("USERCHECK -> ", UserCheck);
    // 페이지 강제 접속시 userCheck empty object 버그
    let { data } = await axios.post(`http://localhost:4000/user/${UserCheck?.id}/likes`, {
      token,
      productId: Number(id),
    });
    console.log("liked", data.liked);
    setIsHeartPressed(data.liked);
  };

  useEffect(() => {
    setUserData(UserCheck);
    getSingleData();
    //get user likes
  }, []);

  useEffect(() => {
    console.log("IS BOOK LIEKD?????");
    let isPressed = bookLiked();
  }, [UserCheck]);

  return isPc ? (
    <Container>
      <TitleBox>
        <Title>상세보기</Title>
      </TitleBox>
      <KeyInfoBox>
        <BookImg src={images && images[0].url} />
        <KeyInfo>
          <BookTitle>{title}</BookTitle>
          <BorderBottom />
          <UserInfoBox>
            <UserBox>
              <UserAvatar src={avatar} />
              <UserNickname>{nickname}</UserNickname>
            </UserBox>
            {isWriter ? (
              <UserModifyBox>
                <BookStatusTitle>도서 상태 관리</BookStatusTitle>
                <Div>
                  <BookStatusBox>
                    <BookStatusChangeBox>
                      <BooksStatusChange>상태 변경</BooksStatusChange>
                      <StatusCheck>
                        <CheckList
                          type="radio"
                          id="can"
                          name="status"
                          checked={isSold}
                          onClick={handleClickExchange}
                        ></CheckList>
                        <Checklabel htmlFor="can">교환완료</Checklabel>
                        <CheckList type="radio" id="cannot" name="status" checked={!isSold}></CheckList>
                        <Checklabel htmlFor="cannot">교환가능</Checklabel>
                      </StatusCheck>
                    </BookStatusChangeBox>
                  </BookStatusBox>
                  <ModifyButtonBox>
                    <ModifyButton>수정</ModifyButton>
                    <ModifyButton onClick={handleClickDelete}>삭제</ModifyButton>
                  </ModifyButtonBox>
                </Div>
              </UserModifyBox>
            ) : null}
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
            {isWriter ? (
              <TouchButton isWriter={isWriter} onClick={handleChangePage}>
                내 책장 관리
              </TouchButton>
            ) : (
              <>
                <HeartButton onClick={handleClickHeart}>
                  {isHeartPressed ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
                </HeartButton>
                <TouchButton isWriter={isWriter}>연락하기</TouchButton>
              </>
            )}
          </ButtonBox>
        </KeyInfo>
      </KeyInfoBox>
    </Container>
  ) : (
    <MobileDetail />
  );
};

export default Details;
