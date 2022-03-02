import styled from "styled-components";

const Contianer = styled.div`
  box-shadow: 0px 1px 7px 0px rgb(0, 0, 0, 0.1);
  background-color: white;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  bottom: 0px;
`;

const AboutUsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;

const LinkBox = styled.a`
  text-decoration: none;
  i {
    font-size: 24px;
    color: black;
  }
`;

const Title = styled.div`
  margin-bottom: 10px;
`;

const TeamMember = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MemberInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
`;
const Name = styled.a`
  margin-bottom: 5px;
`;

const Role = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
`;

const Copyright = styled.div`
  margin: 10px;
`;

const Footer = () => {
  return (
    <Contianer>
      <AboutUsBox>
        <Title>ABOUT US</Title>
        <LinkBox href="https://github.com/codestates/dongnebook" target="_blank">
          <i className="fab fa-github"></i>
        </LinkBox>
      </AboutUsBox>
      <TeamMember>
        <MemberInfoBox>
          <Name href="https://github.com/sophiecode1105" target="_blank">
            이채영
          </Name>
          <Role>FRONT-END</Role>
        </MemberInfoBox>
        <MemberInfoBox>
          <Name href="https://github.com/codingbe" target="_blank">
            김정환
          </Name>
          <Role>FULL-STACK</Role>
        </MemberInfoBox>
        <MemberInfoBox>
          <Name href="https://github.com/KongJin" target="_blank">
            진공
          </Name>
          <Role>BACK-END</Role>
        </MemberInfoBox>
        <MemberInfoBox>
          <Name href="https://github.com/StrummingDown" target="_blank">
            윤대규
          </Name>
          <Role>BACK-END</Role>
        </MemberInfoBox>
      </TeamMember>
      <Copyright>copyright © 2022 dongnebook all rights reserved</Copyright>
    </Contianer>
  );
};

export default Footer;
