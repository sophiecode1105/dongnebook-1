import React, { useState } from "react";
import styled from "styled-components";
import { useForm, ValidationRule } from "react-hook-form";
import { Link } from "react-router-dom";
import { postSignin } from "../../api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
  margin: 0 auto;
  max-width: 360px;
  padding-top: 180px;
`;

const LoginBox = styled.div`
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
`;

const LoginTitle = styled.div`
  /* border: 1px solid blue; */
  color: black;
  font-weight: bold;
  font-size: 23px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0px;
  width: 100%;
  background-color: white;
`;

interface ErrorProps {
  error: string | undefined;
}

const LoginInput = styled.input<ErrorProps>`
  width: 90%;
  text-decoration: none;
  margin-bottom: 20px;
  border: none;
  padding: 20px 20px;
  font-size: 15px;
  border: 1px solid ${(props) => (props.error ? "red" : "rgba(0, 0, 0, 0.2)")};
  /* margin: 10px; */
  &:focus {
    outline: none;
  }
`;

const Errorbox = styled.div`
  color: red;
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 12px;
`;

const LoginButton = styled.button`
  width: 100%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;

interface CheckProps {
  check: boolean;
}

const LoginState = styled.div<CheckProps>`
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 30px;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
  color: grey;
  i {
    color: ${(props) => (props.check ? "green" : null)};
    cursor: pointer;
  }
`;

const Signup = styled(Link)`
  text-decoration: none;
  font-size: 15px;
  margin: 10px 0px;
  font-weight: 600;
  color: grey;
  cursor: grab;
`;

const ButtonContainer = styled.div`
  max-width: 280px;
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
`;

const OauthButton = styled.a`
  all: unset;
  color: black;
  cursor: pointer;
  background-color: #ef463a;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.4s;
  color: black;
  i {
    padding: 10px;
  }
  &:hover {
    background-color: rgb(239, 70, 58, 0.4);
  }

  &:last-child {
    color: rgb(242, 242, 242, 0.9);
    background-color: #181516;
    &:hover {
      background-color: rgb(25, 25, 25, 0.4);
    }
  }
`;

type FormData = {
  email: string;
  password: string;
};

const Signin = () => {
  const [ischeck, setIscheck] = useState(false);
  const [Invalid, setInvalid] = useState(true);

  const handleCheckChange = () => {
    setIscheck(!ischeck);
  };

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const getUser = async () => {
    const { email, password } = getValues();
    try {
      const { id, admin } = await postSignin({ email, password });
      localStorage.setItem("userId", String(id));
      if (admin) {
        localStorage.setItem("admin", String(admin));
      }
      return id;
    } catch (e) {
      throw e;
    }
  };
  const handlelogin = async (e: any) => {
    // e.preventDefault();
    try {
      const id = await getUser();
      if (id) {
        localStorage.setItem("isLogin", String(true));
      }
    } catch (e) {
      // console.log("이건왜안찍혀");
      alert("로그인 실패");
      setInvalid(false);
    }
  };

  const myPattern: ValidationRule<RegExp> = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "이메일 형식으로 입력해주세요",
  };
  const passwordPattern: ValidationRule<RegExp> = {
    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    message: "8자이상 / 영문 / 숫자 / 특수문자를 조합해주세요",
  };
  return (
    <Container>
      <LoginBox>
        <LoginTitle>로그인</LoginTitle>
      </LoginBox>
      <LoginForm onSubmit={handleSubmit(handlelogin)}>
        <LoginInput
          type="text"
          placeholder="이메일"
          error={errors.email?.message}
          {...register("email", {
            required: "이메일을 입력해주세요",
            pattern: myPattern,
          })}
        />
        {Invalid ? <Errorbox>{errors.email?.message}</Errorbox> : <Errorbox>이메일을 다시 확인해주세요</Errorbox>}

        <LoginInput
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            pattern: passwordPattern,
          })}
        />
        {Invalid ? <Errorbox>{errors.password?.message}</Errorbox> : <Errorbox>비밀번호를 다시 확인해주세요</Errorbox>}
        <LoginState check={ischeck}>
          <i onClick={handleCheckChange} className="far fa-check-circle"></i>
          &nbsp; 로그인 상태 유지
        </LoginState>
        <LoginButton type="submit">로그인</LoginButton>
      </LoginForm>

      <Signup to="/signup">회원가입</Signup>
      <ButtonContainer>
        <OauthButton>
          <i className="fab fa-google"></i>
          Google로 로그인
        </OauthButton>
        <OauthButton>
          <i className="fab fa-github"></i>
          Github로 로그인
        </OauthButton>
      </ButtonContainer>
    </Container>
  );
};

export default Signin;
