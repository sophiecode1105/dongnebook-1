import styled from "styled-components";
import { ReactComponent as ChatIcon } from "../../svg/Chat_icon.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const AlertContent = styled.div`
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
`;

const EmtyChatRoom = () => {
  return (
    <Container>
      <ChatIcon />
      <AlertContent>개설된 채팅방이 없습니다.</AlertContent>
      <AlertContent>채팅을 통하여 원하는 도서를 교환해보세요.</AlertContent>
    </Container>
  );
};

export default EmtyChatRoom;
