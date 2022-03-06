import styled from "styled-components";
import mapImg from "../../img/map.png";

const Wrap = styled.div`
  width: 100%;
  background-color: white;
  padding: 50px 0px 50px 0px;
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
  font-size: 28px;
  margin-bottom: 20px;
`;

const Explain = styled.div`
  color: black;
  font-size: 33px;
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
        <Title>위치 서비스</Title>
        <Explain>내 위치를 확인하고</Explain>
        <Explain className="mb-6">주변 도서를 찾아보세요</Explain>
        <ImgBox>
          <Img src={mapImg}></Img>
        </ImgBox>
        <p className="text-right text-xl">
          굳이 서점을 갈 필요가 있을까요? <br /> 내 주위 먼저 둘러보세요
        </p>
      </Container>
    </Wrap>
  );
};
export default LocationService;
