import styled from "styled-components";
import { BookInfo, ChatRoomFrameType, CurrentImgProps, isWriterProps, UserState } from "../../state/typeDefs";

const Container = styled.div`
  height: 100vh;
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 66px 15px 0px 15px;
  border: 1px solid red;
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
  width: 300px;
  height: 100%;
  margin-top: 1px;
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
  transform: translate3d(${(props) => props.Cm * -300}px, 0px, 0px);
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
  width: 300px;
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
  width: 300px;
  height: 440px;
  object-fit: fill;
`;

const MobileDetail = ({
  bookDetailInfo,
  likeCount,
  onChangeContent,
  currentImg,
}: {
  bookDetailInfo: any;
  likeCount: number;
  onChangeContent: any;
  currentImg: any;
}) => {
  const { title, images, content, quality, createdAt, locations, nickname, visit, users } = bookDetailInfo;
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
    </Container>
  );
};
export default MobileDetail;
