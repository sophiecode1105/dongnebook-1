import styled from "styled-components";
import IphoneChat from "../../img/chat.png";
import IphoneDetail from "../../img/detail.png";
import { useMediaQuery } from "react-responsive";

const Wrap = styled.div`
  width: 100%;
  background-color: #f1f5f0;
  padding: 80px 0px;
`;

const TitleBox = styled.div`
  width: 100%;
  margin: 0px 0px 30px 0px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding-left: 35px;
  font-family: "Montserrat", "NotoSansKR", sans-serif;
`;

const Title = styled.div`
  color: green;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Explain = styled.div`
  color: black;
  font-size: 26px;
  font-weight: 400;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  max-width: 1200px;
  padding: 10px;
  position: relative;
`;

const ScreenBoxOne = styled.div`
  position: absolute;
  margin-top: 50px;
  top: -5%;
  left: 10%;
`;

const ScreenBoxTwo = styled.div`
  position: absolute;
  bottom: 2%;
  right: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScreenShot = styled.img`
  max-width: 350px;
  width: 50vw;
  margin-bottom: 10px;
  filter: drop-shadow(10px 10px 15px #000);
`;

const ContentBox = styled.div`
  text-align: center;
`;

type pcProps = {
  isPc: boolean;
};

const Content = styled.div<pcProps>`
  font-size: ${(props) => (props.isPc ? "1.4rem" : "18px")};
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
`;

const ChattingService = () => {
  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);

  return (
    <Wrap>
      <TitleBox className="sa sa-up">
        <Title>채팅</Title>
        <Explain>게시글을 확인하고 </Explain>
        <Explain>교환 약속을 잡으세요</Explain>
      </TitleBox>
      <Container>
        <ScreenBoxOne className="sa sa-up">
          <ScreenShot src={IphoneDetail} />
        </ScreenBoxOne>
        <ScreenBoxTwo className="sa sa-up">
          <ScreenShot src={IphoneChat} />
          <ContentBox>
            <Content isPc={isPc}>중고 교환은 타이밍!</Content>
            <Content isPc={isPc}>실시간 대화로 더 빠르게 거래하세요</Content>
          </ContentBox>
        </ScreenBoxTwo>
      </Container>
    </Wrap>
  );
};
export default ChattingService;
