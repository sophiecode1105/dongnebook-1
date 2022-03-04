import styled from "styled-components";
import { ReactComponent as LocationSvg } from "../../svg/Location.svg";
import { ReactComponent as ExchangeSvg } from "../../svg/Exchange.svg";
import { ReactComponent as ChatSvg } from "../../svg/Chat.svg";

const Container = styled.section`
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin: 200px auto;
  flex-direction: column;
  align-items: center;
`;

const Introduce = styled.h2`
  font-size: 20px;
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  color: #aaaaaa;
  font-weight: 900;
  margin: 5px;
`;

const KeyPlatform = styled.h3`
  font-size: 28px;
  text-align: center;
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  font-weight: 700;
  margin: 15px auto;
  padding: 10px;
`;

const List = styled.div`
  padding: 0px 15px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 330px;
  width: 100%;
  display: grid;
  grid-gap: 100px;
  margin: 0 auto;
`;

const ExchangeWrap = styled.div`
  /* margin-bottom: 10px; */
`;

const Wrap = styled.div`
  padding: 32px 0px 30px 0px;
`;

const ChatWrap = styled.div`
  padding: 55px 0px 60px 0px;
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 20px;
`;

const LocTitle = styled.div`
  font-size: 25px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  margin: 20px 0px 20px 0px;
`;

const ChatTitle = styled.div`
  font-size: 25px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  margin-bottom: 22px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div``;

const AnimationIcon = () => {
  return (
    <Container>
      <Introduce>PLATFORM STORY</Introduce>
      <KeyPlatform>EXCHANGE LOCATION AND CHATTING</KeyPlatform>
      <List>
        <Box>
          <ExchangeWrap>
            <ExchangeSvg />
          </ExchangeWrap>
          <Title>Exchange</Title>
          <Content>중고 도서 교환을 통하여</Content>
          <Content>환경과 비용을 고려한 플랫폼입니다</Content>
        </Box>
        <Box>
          <Wrap>
            <LocationSvg />
          </Wrap>
          <LocTitle>Location</LocTitle>
          <Content>위치기반으로</Content>
          <Content>우리 동네 도서 확인이 가능합니다</Content>
        </Box>
        <Box>
          <ChatWrap>
            <ChatSvg />
          </ChatWrap>
          <ChatTitle>Chatting</ChatTitle>
          <Content>회원들간의 실시간</Content>
          <Content>1:1 채팅 서비스를 지원합니다</Content>
        </Box>
      </List>
    </Container>
  );
};
export default AnimationIcon;
