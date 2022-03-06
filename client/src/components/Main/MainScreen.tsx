import styled from "styled-components";
import bookImg from "../../img/book.png";
import { ReactComponent as SecondLogo } from "../../svg/Dongnebook.svg";
import { Link } from "react-router-dom";

const Wrap = styled.div`
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1200px;
  margin: 0 auto;
  max-width: 1000px;
  padding: 66px 10px 10px 10px;
`;
const ImgBox = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 55%;
`;
const Img = styled.img`
  width: 600px;
`;
const TitleBox = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  width: 100%;
  padding-left: 60px;
  @media screen and (max-width: 767px) {
    align-items: center;
    padding: 0;
  }
`;

const Title = styled.div`
  font-size: 29px;
  font-weight: bold;
`;

const LogoBox = styled.div`
  margin-top: 20px;
  width: 300px;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  width: 300px;
  height: 50px;
  border-radius: 15px;
  font-weight: bold;
  background-color: #e4f3e0;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const MainScreen = () => {
  return (
    <Wrap>
      <Container>
        <Div>
          <TitleBox>
            <Title>우리동네 </Title>
            <Title>위치 기반 도서 교환 플랫폼</Title>
            <LogoBox>
              <SecondLogo></SecondLogo>
            </LogoBox>
            <Button to="/around">체험하기</Button>
          </TitleBox>
        </Div>
        <ImgBox>
          <Img src={bookImg}></Img>
        </ImgBox>
      </Container>
    </Wrap>
  );
};

export default MainScreen;
