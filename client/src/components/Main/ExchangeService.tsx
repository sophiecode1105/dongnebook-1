import styled from "styled-components";
import swap from "../../img/swap.png";
import swap2 from "../../img/swap2.png";
import { useMediaQuery } from "react-responsive";

const Wrap = styled.div`
  width: 100%;
  background-color: #f1f5f0;
  padding: 80px 0px;
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
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

const Content = styled.p<pcProps>`
  font-size: ${(props) => (props.isPc ? "1.4rem" : "18px")};
  font-family: "Montserrat", "NotoSansKR", sans-serif;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  text-align: right;
  margin-bottom: 20px;
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: flex-end;
  text-align: right;
  align-items: center;
  width: 100%;
`;
type pcProps = {
  isPc: boolean;
};
const SwapImage = styled.img<pcProps>`
  width: 80%;
  height: ${(props) => (props.isPc ? "500px" : "300px")};
`;

const ExchangeService = () => {
  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);

  return (
    <Wrap>
      <Container>
        <Title className="sa sa-up">교환</Title>
        <Explain className="sa sa-up mb-6">
          비용은 제로 <br /> 환경을 보호 할 수 있어요
        </Explain>
        <ImgBox className="sa sa-right">
          <SwapImage isPc={isPc} src={isPc ? `${swap}` : `${swap2}`} />
        </ImgBox>
        <Content isPc={isPc}>
          도서 교환에 참여함으로써
          <br />
          물건의 수명을 늘리는 주체가 되어 보세요
        </Content>
      </Container>
    </Wrap>
  );
};
export default ExchangeService;
