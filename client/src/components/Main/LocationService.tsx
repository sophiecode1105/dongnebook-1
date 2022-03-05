import styled from "styled-components";
import mapImg from "../../img/map.png";

const Wrap = styled.div`
  width: 100%;
  background-color: white;
  padding: 50px 0px 50px 0px;
`;

const Container = styled.div`
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  grid-auto-rows: 500px;
  width: 100%;
  display: grid;
  grid-gap: 40px;
  width: 100%;
  height: 700px;
  margin: 0 auto;
  border: 2px solid black;
  max-width: 1200px;
`;

const Title = styled.div`
  border: 1px solid blue;
  color: green;
  font-size: 28px;
  margin-bottom: 20px;
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  width: 500px;
  height: 700px;
`;

const Img = styled.img`
  filter: drop-shadow(5px 5px 5px grey);
`;
const LocationService = () => {
  return (
    <Wrap>
      <Container>
        <Title>위치 서비스</Title>
        <ImgBox>
          <Img src={mapImg}></Img>
        </ImgBox>
      </Container>
    </Wrap>
  );
};
export default LocationService;
