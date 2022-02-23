import { useEffect } from "react";
import styled from "styled-components";
import { getMemberInfo } from "../../api";
import { ErrorProps } from "../../state/typeDefs";
import { useForm, ValidationRule } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { userState } from "../../state/state";

const DisplayProps = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
`;

const Container = styled(DisplayProps)`
  padding: 66px 0px 20px 0px;
  max-width: 1200px;
  border: 1px solid red;
`;

const TitleBox = styled.div`
  width: 85%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const Form = styled.form`
  max-width: 360px;
  border: 1px solid blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-radius: 100%;
  width: 120px;
  height: 120px;
  margin: 30px 0px;
  &:hover {
    Div {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.4);
      color: white;
    }
  }
`;

const UserAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 100%;
  border: 1px solid black;
`;

const ImgFile = styled.input`
  text-decoration: none;
  width: 120px;
  height: 120px;
  top: 0;
  left: 0;
  position: absolute;
  font-size: 100;
  opacity: 0;
`;

const InputLabel = styled.label`
  width: 90%;
  display: flex;
  margin-bottom: 3px;
  color: grey;
  font-weight: bold;
  border: 1px solid black;
`;

const Input = styled.input`
  width: 90%;
  padding: 20px 20px;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const Text = styled.div`
  position: absolute;
  opacity: 0;
  width: 120px;
  height: 120px;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type FormData = {
  nickname: string;
  email: string;
  certification: string | undefined;
  password: string;
  password2: string;
  address: string;
  img: FileList;
};

const Account = () => {
  const user = useRecoilValue(userState);
  const { img } = user;
  console.log(user);
  const {
    register,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  return (
    <Container>
      <TitleBox>
        <Title>회원정보 수정</Title>
      </TitleBox>
      <Form>
        <Label htmlFor="input_file">
          <Text>
            이미지 <br />
            업로드
          </Text>
          <UserAvatar src={img} />
          <ImgFile id="input_file" type="file" accept="image/*" multiple {...register("img")} />
        </Label>
        <InputLabel>닉네임</InputLabel>
        <Input></Input>
        <Input></Input>
      </Form>
    </Container>
  );
};

export default Account;
