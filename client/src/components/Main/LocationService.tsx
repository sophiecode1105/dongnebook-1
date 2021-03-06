import styled from "styled-components";
import mapImg from "../../img/map.png";
import { useMediaQuery } from "react-responsive";

const Wrap = styled.div`
  width: 100%;
  background-color: white;
  padding: 80px 0px;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  /* height: 700px; */
  margin: 0 auto;
  padding: 0 35px;
`;

const Title = styled.div`
  color: green;
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bold;
`;

const Explain = styled.div`
  color: black;
  font-size: 26px;
  font-weight: 400;
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

type pcProps = {
  isPc: boolean;
};

const Content = styled.p<pcProps>`
  font-size: ${(props) => (props.isPc ? "1.4rem" : "18px")};
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  text-align: right;
`;

const Img = styled.img`
  filter: drop-shadow(5px 5px 5px grey);
`;

const LocationService = () => {
  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);

  return (
    <Wrap>
      <Container>
        <Title className="sa sa-up">위치</Title>
        <Explain className="sa sa-up mb-6">
          내 위치를 확인하고 <br /> 주변 도서를 찾아보세요
        </Explain>
        <ImgBox className="sa sa-left">
          <Img src={mapImg}></Img>
        </ImgBox>
        <Content isPc={isPc}>
          굳이 서점을 갈 필요가 있을까요? <br /> 내 주위 먼저 둘러보세요
        </Content>
      </Container>
    </Wrap>
  );
};
export default LocationService;
