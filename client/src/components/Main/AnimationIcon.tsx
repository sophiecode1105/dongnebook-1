import styled from "styled-components";
import { ReactComponent as LocationSvg } from "../../svg/Location.svg";
import { ReactComponent as ExchangeSvg } from "../../svg/Exchange.svg";
import { ReactComponent as ChatSvg } from "../../svg/Chat.svg";
import { useEffect, useRef, useState } from "react";

const ContainerWrap = styled.div`
  width: 100%;
`;

const Container = styled.section`
  max-width: 1200px;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  display: flex;
  margin: 0 auto;
  padding: 300px 0;
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
  grid-gap: 100px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 330px;
  width: 100%;
  display: grid;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
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
  const [show, setShow] = useState(false);

  return (
    <ContainerWrap
      onMouseOver={() => {
        setShow(true);
      }}
    >
      <Container>
        <Introduce className="sa sa-up">PLATFORM STORY</Introduce>
        <KeyPlatform className="sa sa-up">EXCHANGE LOCATION AND CHATTING</KeyPlatform>
        <List className="sa sa-right">
          <Box>
            <ExchangeWrap>
              {show ? <ExchangeSvg className="sa show" /> : <div style={{ width: "200px", height: "200px" }}></div>}
            </ExchangeWrap>
            <Title>Exchange</Title>
            <Content>중고 도서 교환을 통하여</Content>
            <Content>환경과 비용을 고려한 플랫폼입니다</Content>
          </Box>
          <Box>
            <Wrap>
              {show ? (
                <LocationSvg className="sa show" />
              ) : (
                <div
                  style={{
                    width: "120px",
                    height: "110px",
                  }}
                ></div>
              )}
            </Wrap>
            <LocTitle>Location</LocTitle>
            <Content>위치기반으로</Content>
            <Content>우리 동네 도서 확인이 가능합니다</Content>
          </Box>
          <Box>
            <ChatWrap>
              {show ? <ChatSvg className="sa show" /> : <div style={{ width: "90px", height: "84px" }}></div>}
            </ChatWrap>
            <ChatTitle>Chatting</ChatTitle>
            <Content>회원들간의 실시간</Content>
            <Content>1:1 채팅 서비스를 지원합니다</Content>
          </Box>
        </List>
      </Container>
    </ContainerWrap>
  );
};
export default AnimationIcon;
