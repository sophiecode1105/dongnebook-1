import styled from "styled-components";
import { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { loginState, userState } from "../../state/state";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../../api";
import Swal from "sweetalert2";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 35%;
  width: 320px;
`;

const UserInfoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30%;
  width: 320px;
`;

const UserAvatar = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50px;
  margin-right: 20px;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Nickname = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const Address = styled.div``;

const ButtonBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  text-align: center;
  width: 30%;
  height: 100%;
  cursor: pointer;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
`;

const MemberInfo = () => {
  const user = useRecoilValue(userState);
  const [token, setToken] = useRecoilState(loginState);

  const navigate = useNavigate();
  const { img, nickname, locations } = user;

  const handleChangePage = () => {
    navigate("/account");
  };

  const handleClickRemove = async () => {
    let result = await Swal.fire({
      text: "회원탈퇴를 하시겠습니까?",
      confirmButtonText: "확인",
      confirmButtonColor: "#2f6218",
      cancelButtonText: "취소",
      cancelButtonColor: "#b2b0b0;",
      showCancelButton: true,
      reverseButtons: true,
      icon: "warning",
    });
    if (result.isConfirmed) {
      await deleteAccount(token);
      localStorage.removeItem("token");
      setToken(null);
      navigate("/");
    }
  };

  return (
    <Container>
      <UserInfoBox>
        <UserAvatar src={img} />
        <InfoBox>
          <Nickname>{nickname}</Nickname>
          <Address>{locations?.address}</Address>
        </InfoBox>
      </UserInfoBox>
      <ButtonBox>
        <Button onClick={handleClickRemove}>탈퇴</Button>
        <Button onClick={handleChangePage}>수정</Button>
      </ButtonBox>
    </Container>
  );
};
export default MemberInfo;
