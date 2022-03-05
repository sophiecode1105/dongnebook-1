import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 50%;
  height: 50px;
  border-radius: 15px;
  font-weight: bold;
  background-color: #e4f3e0;
`;

const Start = () => {
  return (
    <Container>
      <Button to="/search">시작하기</Button>
    </Container>
  );
};
export default Start;
