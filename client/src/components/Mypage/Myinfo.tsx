import styled from "styled-components";
import MemberInfo from "./MemberInfo";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  padding: 66px 0px 20px 0px;
  max-width: 1200px;
  height: 100vh;
  border: 1px solid red;
`;

const MypageBox = styled.div`
  width: 85%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const MypageTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const Myinfo = () => {
  return (
    <Container>
      <MypageBox>
        <MypageTitle>마이페이지</MypageTitle>
      </MypageBox>
      <MemberInfo />
    </Container>
  );
};
export default Myinfo;
