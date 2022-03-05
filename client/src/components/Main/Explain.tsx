import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 550px;
  margin: 0 auto;
  background-color: #f1f5f0;
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: 500;
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  margin: 3px;
`;

const Subtitle = styled.div`
  margin: 5px;
  font-size: 18px;
  color: grey;
  font-family: "Montserrat", "NotoSansKR", sans-serif;
`;

const Explain = () => {
  return (
    <Container>
      <Title>이제껏 경험 못 했던 쉽고 편리한 도서 교환 서비스,</Title>
      <Title>동네북과 함께라면 당신의 일상이 새로워질 거예요</Title>
      <Subtitle>버리긴 아깝고 쌓여만 가는 책들 새로운 책과 교환해보세요</Subtitle>
    </Container>
  );
};
export default Explain;
