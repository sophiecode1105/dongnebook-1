import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { CurrentImgProps } from "../../state/typeDefs";
import { timeForToday, postHeart, getMemberInfo } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginState } from "../../state/state";

const Container = styled.div`
  height: 100%;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 66px 15px 0px 15px;
  max-width: 360px;
`;

const TitleBox = styled.div`
  width: 100%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const ImageSlide = styled.div`
  position: relative;
  width: 280px;
  margin: 20px 0px;
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
  transform: translate3d(${(props) => props.Cm * -280}px, 0px, 0px);
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
  width: 280px;
  height: 100%;
  text-align: center;
`;

const Button = styled.div``;

const ButtonProps = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 170px;
  width: 50px;
  height: 50px;
  padding: 15px;
  color: grey;
  vertical-align: middle;
  cursor: pointer;
`;

const ButtonPrev = styled(ButtonProps)`
  left: -45px; ;
`;
const ButtonNext = styled(ButtonProps)`
  right: -45px;
`;

const BookImg = styled.img`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  width: 280px;
  height: 350px;
  object-fit: fill;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 92%;
  padding: 0px 0px 15px 0px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;
const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
  object-fit: cover;
`;
const UserNickname = styled.div`
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  width: 110px;
  margin-right: 5px;
  font-size: 15px;
  font-weight: bold;
`;
const Row = styled.div`
  display: flex;
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

const IconstyleProps = styled.div`
  color: rgba(0, 0, 0, 0.4);
  padding: 5px;
  margin: 3px;
  i {
    font-size: 22px;
  }
`;

type HeartProps = {
  isHeartPressed: boolean;
};

const HeartPress = styled(IconstyleProps)<HeartProps>`
  i {
    color: ${(props) => (props.isHeartPressed ? "red" : "rbag(0,0,0,0.4)")};
  }
`;

const Chat = styled(IconstyleProps)``;
const Edit = styled(IconstyleProps)``;
const Trash = styled(IconstyleProps)``;

const IconBoxProps = styled.div`
  display: flex;
  align-items: center;
`;

const IconBox = styled(IconBoxProps)`
  justify-content: flex-end;
  width: 100px;
`;

const SecondIconBox = styled(IconBoxProps)`
  height: 15%;
  /* padding: 0px 20px; */
  width: 95%;
  /* border: 1px solid red; */
`;

const StatusBox = styled.div`
  display: flex;
  width: 90%;
  margin-top: 10px;
`;

const Explanation = styled.li`
  width: 30%;
  color: rgba(0, 0, 0, 0.5);
`;

const DetailContent = styled.div`
  color: rgba(0, 0, 0, 0.8);
`;

const BookTitle = styled.div`
  width: 95%;
  height: 50px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  margin-top: 10px;
`;

const Content = styled.div`
  width: 95%;
  padding: 10px;
  margin: 20px 0px;
`;

const MobileDetail = ({
  bookDetailInfo,
  likeCount,
  onChangeContent,
  currentImg,
  userInfo,
  setUserInfo,
  token,
  handleClickChat,
  handleClickModify,
  handleClickDelete,
}: {
  bookDetailInfo: any;
  likeCount: number;
  onChangeContent: any;
  currentImg: any;
  userInfo: any;
  setUserInfo: any;
  token: string | null;
  handleClickChat: any;
  handleClickModify: any;
  handleClickDelete: any;
}) => {
  let { id } = useParams();
  const { title, images, content, quality, createdAt, locations, nickname, visit, users } = bookDetailInfo;
  const [isHeartPressed, setIsHeartPressed] = useState(false);
  const isWriter = userInfo?.nickname === nickname;
  const date = timeForToday(createdAt);
  const navigate = useNavigate();

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

  const getUserInfo = useCallback(async () => {
    const { userInfo } = await getMemberInfo(token || "token");
    setUserInfo(userInfo);
  }, [setUserInfo, token]);

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

  return (
    <Container>
      <TitleBox>
        <Title>상세보기</Title>
      </TitleBox>

      <ImageSlide>
        <SlideBox>
          <SlideList Cm={currentImg}>
            {images?.map((img: any, idx: any) => {
              return (
                <SlideContent key={idx}>
                  <BookImg src={img?.url} />
                </SlideContent>
              );
            })}
          </SlideList>
        </SlideBox>
        {images?.length >= 2 ? (
          <Button>
            <ButtonPrev
              onClick={() => {
                onChangeContent(-1);
              }}>
              <i className="fas fa-chevron-left"></i>
            </ButtonPrev>
            <ButtonNext
              onClick={() => {
                onChangeContent(+1);
              }}>
              <i className="fas fa-chevron-right"></i>
            </ButtonNext>
          </Button>
        ) : null}
      </ImageSlide>
      <UserBox>
        <Row>
          <UserAvatar src={users?.img} />
          <UserNickname>{nickname}</UserNickname>
        </Row>
        <IconBox>
          <HeartPress isHeartPressed={isHeartPressed} onClick={handleClickHeart}>
            {isHeartPressed ? <i className="fas fa-heart"></i> : <i className="far fa-heart"></i>}
          </HeartPress>
          {isWriter ? (
            <>
              <Edit onClick={handleClickModify}>
                <i className="fas fa-edit"></i>
              </Edit>
              <Trash onClick={handleClickDelete}>
                <i className="fas fa-trash-alt"></i>
              </Trash>
            </>
          ) : (
            <Chat onClick={handleClickChat}>
              <i className="far fa-comment-dots"></i>
            </Chat>
          )}
        </IconBox>
      </UserBox>
      <BookTitle>{title}</BookTitle>
      <SecondIconBox>
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
      </SecondIconBox>

      <StatusBox>
        <Explanation>상품상태</Explanation>
        <DetailContent>{quality}</DetailContent>
      </StatusBox>
      <StatusBox>
        <Explanation>거래지역</Explanation>
        <DetailContent>{locations?.address}</DetailContent>
      </StatusBox>
      <Content>{content}</Content>
    </Container>
  );
};
export default MobileDetail;
