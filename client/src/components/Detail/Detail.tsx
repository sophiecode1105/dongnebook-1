import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import {
  deleteContent,
  getSingleBookInfo,
  patchExchange,
  postHeart,
  timeForToday,
  socket,
  getMemberInfo,
} from "../../api";
import { BookInfo, ChatRoomFrameType, CurrentImgProps, isWriterProps } from "../../state/typeDefs";
import { useMediaQuery } from "react-responsive";
import MobileDetail from "./MobileDetail";
import { chatRoomFrame, chatRoomVisible, loginState, storeContentId, userState } from "../../state/state";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";

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
  width: 1160px;
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
  width: 1145px;
  height: 550px;
  margin: 30px;
`;

const ImageSlide = styled.div`
  position: relative;
  width: 400px;
  height: 100%;
`;

const SlideBox = styled.div`
  position: relative;
  width: 100%;
  margin: auto;
  overflow-x: hidden;
  background-color: white;
`;

const SlideList = styled.div<CurrentImgProps>`
  width: 1300px;
  transition: all 30ms ease 0s;
  overflow: hidden;
  transition: all 0.3s;
  transform: translate3d(${(props) => props.Cm * -400}px, 0px, 0px);
  animation: smoothslide 0.3s ease-in-out;
  @keyframes smoothslide {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const SlideContent = styled.div`
  display: table;
  float: left;
  width: 400px;
  height: 100%;
  text-align: center;
`;

const ButtonProps = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 200px;
  width: 50px;
  height: 50px;
  padding: 15px;
  color: grey;
  vertical-align: middle;
  cursor: pointer;
`;

const ButtonPrev = styled(ButtonProps)`
  left: -50px; ;
`;
const ButtonNext = styled(ButtonProps)`
  right: -50px;
`;

const BookImg = styled.img`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  width: 400px;
  height: 540px;
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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  object-fit: cover;
`;
const UserNickname = styled.div`
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  width: 130px;
  margin-right: 20px;
  font-size: 18px;
  font-weight: bold;
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
const Visit = styled(IconProps)``;
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
  const [userInfo, setUserInfo] = useRecoilState(userState);
  const storeId = useSetRecoilState(storeContentId);
  const [likeCount, setLikeCount] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const setVisible = useSetRecoilState(chatRoomVisible);
  const setChatRoomFrame = useSetRecoilState(chatRoomFrame);

  const token = useRecoilValue(loginState);

  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);
  const { title, images, content, quality, createdAt, locations, nickname, visit, users } = bookDetailInfo as BookInfo;
  let { exchanged } = bookDetailInfo as BookInfo;
  const date = timeForToday(createdAt);
  const navigate = useNavigate();
  const isWriter = userInfo?.nickname === nickname;

  const onChangeContent = (pageDelta: any) => {
    const lastImgPageNum = images.length - 1;
    const newCurrentPageNum = currentImg + pageDelta;

    if (newCurrentPageNum < 0) {
      setCurrentImg(lastImgPageNum);
    } else if (newCurrentPageNum > lastImgPageNum) {
      setCurrentImg(0);
    } else {
      setCurrentImg(newCurrentPageNum);
    }
  };

  const getSingleData = useCallback(async () => {
    const { productInfo, likeCount } = await getSingleBookInfo(Number(id), token);

    setBookDetailInfo(productInfo);
    setLikeCount(likeCount);
  }, [id, token]);

  const handleClickHeart = async () => {
    try {
      if (token) {
        await postHeart(Number(id), token);
        setIsHeartPressed(!isHeartPressed);
      } else {
        navigate("/signin");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleChangePage = () => {
    navigate("/mypage");
  };

  const handleClickModify = () => {
    storeId(Number(id));
    localStorage.setItem("modify_id", String(id));
    localStorage.setItem("whichmap", "수정");
    navigate("/modify");
  };
  const handleClickDelete = async () => {
    let result = await Swal.fire({
      text: "게시글을 삭제하시겠습니까?",
      confirmButtonText: "확인",
      confirmButtonColor: "#2f6218",
      cancelButtonText: "취소",
      cancelButtonColor: "#b2b0b0",
      showCancelButton: true,
      reverseButtons: true,
      icon: "warning",
    });
    if (result.isConfirmed) {
      await deleteContent(Number(id));
      navigate("/search");
    }
  };

  const handleClickExchange = async (e: any, state: boolean) => {
    if (state !== exchanged) {
      await patchExchange(Number(id));
      exchanged = !exchanged;
      Swal.fire({
        text: "교환 상태가 변경되었습니다.",
        confirmButtonText: "확인",
        confirmButtonColor: "#2f6218",
        icon: "success",
      });
    }
  };

  const handleClickChat = () => {
    if (token) {
      socket.emit("enter_room", Number(id), (data: any, chat: any) => {
        setChatRoomFrame({
          nickname: data.nickname,
          title: data.title,
          bookImg: data.images[0].url,
          productId: data.id,
          img: users?.img,
        } as ChatRoomFrameType);

        if (chat) {
          setChatRoomFrame((prev) => {
            return {
              ...prev,
              userId: chat.users[0].users.id,
              img: chat.users[0].users.img,
              chatroomId: chat.id,
              chats: chat.chats,
            };
          });
        }
        setVisible(true);
      });
    } else {
      navigate("/signin");
    }
  };

  const getUserInfo = useCallback(async () => {
    const { userInfo } = await getMemberInfo(token || "token");
    setUserInfo(userInfo);
  }, [setUserInfo, token]);

  useEffect(() => {
    getSingleData();
  }, [getSingleData]);

  useEffect(() => {
    try {
      const matches = userInfo?.likes?.filter((el: any) => el.products.id === Number(id));
      if (matches?.length) {
        setIsHeartPressed(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id, userInfo?.likes]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return isPc ? (
    <Container>
      <TitleBox>
        <Title>상세보기</Title>
      </TitleBox>
      <KeyInfoBox>
        <ImageSlide>
          <SlideBox>
            <SlideList Cm={currentImg}>
              {images?.map((img, idx) => {
                return (
                  <SlideContent key={idx}>
                    <BookImg src={img?.url} />
                  </SlideContent>
                );
              })}
            </SlideList>
          </SlideBox>
          {images?.length >= 2 ? (
            <>
              <ButtonPrev
                onClick={() => {
                  onChangeContent(-1);
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </ButtonPrev>
              <ButtonNext
                onClick={() => {
                  onChangeContent(+1);
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </ButtonNext>
            </>
          ) : null}
        </ImageSlide>
        <KeyInfo>
          <BookTitle>{title}</BookTitle>
          <BorderBottom />
          <UserInfoBox>
            <UserBox>
              <UserAvatar src={users?.img} />
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
                          onClick={(e) => {
                            handleClickExchange(e, true);
                          }}
                          defaultChecked={exchanged}
                        ></CheckList>
                        <Checklabel htmlFor="can">교환완료</Checklabel>
                        <CheckList
                          type="radio"
                          id="cannot"
                          name="status"
                          onClick={(e) => {
                            handleClickExchange(e, false);
                          }}
                          defaultChecked={!exchanged}
                        ></CheckList>
                        <Checklabel htmlFor="cannot">교환가능</Checklabel>
                      </StatusCheck>
                    </BookStatusChangeBox>
                  </BookStatusBox>
                  <ModifyButtonBox>
                    <ModifyButton onClick={handleClickModify}>수정</ModifyButton>
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
            <Letter>{likeCount}</Letter>
            <Visit>
              <i className="fas fa-eye"></i>
            </Visit>
            <Line> </Line>
            <Letter>{visit}</Letter>
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
                <TouchButton isWriter={isWriter} onClick={handleClickChat}>
                  연락하기
                </TouchButton>
              </>
            )}
          </ButtonBox>
        </KeyInfo>
      </KeyInfoBox>
    </Container>
  ) : (
    <MobileDetail
      bookDetailInfo={bookDetailInfo}
      likeCount={likeCount}
      onChangeContent={onChangeContent}
      currentImg={currentImg}
      userInfo={userInfo}
      setUserInfo={setUserInfo}
      token={token}
      handleClickChat={handleClickChat}
      handleClickModify={handleClickModify}
      handleClickDelete={handleClickDelete}
    />
  );
};

export default Details;
