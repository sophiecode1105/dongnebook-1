import styled from "styled-components";
import mapImg from "../../img/map.png";

const Wrap = styled.div`
  width: 100%;
  background-color: #f1f5f0;
  padding: 50px 0px 50px 0px;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  height: 700px;
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

const Img = styled.img`
  filter: drop-shadow(5px 5px 5px grey);
`;

const LocationService = () => {
  return (
    <Wrap>
      <Container>
        <Title className="sa sa-up">위치 서비스</Title>
        <Explain className="sa sa-up mb-6">
          내 위치를 확인하고 <br /> 주변 도서를 찾아보세요
        </Explain>
        <ImgBox className="sa sa-left">
          <Img src={mapImg}></Img>
        </ImgBox>
        <p className="text-right text-xl sa sa-left mt-5">
          굳이 서점을 갈 필요가 있을까요? <br /> 내 주위 먼저 둘러보세요
        </p>
      </Container>
    </Wrap>
  );
};
export default LocationService;
