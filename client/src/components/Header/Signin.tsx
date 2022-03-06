import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useForm, ValidationRule } from "react-hook-form";
import { postSignin, postSocialLogin } from "../../api";
import { useSetRecoilState } from "recoil";
import { loginState, userState } from "../../state/state";
import { ErrorProps } from "../../state/typeDefs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  max-width: 360px;
  padding: 66px 10px 10px 10px;
`;

const LoginBox = styled.div`
  width: 100%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const LoginTitle = styled.div`
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

const LoginInput = styled.input<ErrorProps>`
  width: 100%;
  text-decoration: none;
  border: none;
  padding: 20px 20px;
  font-size: 15px;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const Errorbox = styled.div`
  color: red;
  margin: 10px 0px;
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

const LoginState = styled.div<{ check: boolean }>`
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 30px;
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
  const navigate = useNavigate();

  const [keep, setKeep] = useState<boolean>(true);
  const [invalid, setInvalid] = useState<boolean>(true);
  const [infoCheck, setInfoCheck] = useState("");
  const setUser = useSetRecoilState(userState);
  const setLogin = useSetRecoilState(loginState);

  const handleCheckChange = () => {
    setKeep(!keep);
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
      const { userInfo, token } = await postSignin({ email, password, keep });
      setUser(userInfo);
      setLogin(token);
      localStorage.setItem("token", token);
      navigate("/");
      window.location.reload();
    } catch (e) {
      setInfoCheck("이메일 혹은 비밀번호가 일치하지 않습니다");
      setInvalid(false);
      throw e;
    }
  };

  const handlelogin = async (e: any) => {
    try {
      getUser();
    } catch (e) {
      throw e;
    }
  };

  const url = new URL(window.location.href);

  const code = url.searchParams.get("code");

  const getSocial = useCallback(async () => {
    const data: any = await postSocialLogin(localStorage.getItem("socialType"), code);
    setUser(data.data.userInfo);
    setLogin(data.data.token);
    localStorage.setItem("token", data.data["token"]);
    navigate("/");
    window.location.reload();
  }, [code, navigate, setLogin, setUser]);

  useEffect(() => {
    if (code) {
      getSocial();
    }
  }, [code, getSocial]);

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
        <Errorbox>{errors.email?.message}</Errorbox>
        <LoginInput
          type="password"
          placeholder="비밀번호"
          error={errors.password?.message}
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            pattern: passwordPattern,
            onChange: () => {
              setInfoCheck("");
              setInvalid(true);
            },
          })}
        />
        {invalid ? <Errorbox>{errors.password?.message}</Errorbox> : <Errorbox>{infoCheck}</Errorbox>}
        <LoginState check={keep}>
          <i onClick={handleCheckChange} className="far fa-check-circle"></i>
          &nbsp; 로그인 상태 유지
        </LoginState>
        <LoginButton type="submit">로그인</LoginButton>
      </LoginForm>

      <Signup to="/signup">회원가입</Signup>
      <ButtonContainer>
        <OauthButton
          onClick={() => {
            localStorage.setItem("socialType", "google");
          }}
          href="https://accounts.google.com/o/oauth2/v2/auth?client_id=828453292333-k9rhtk69gvclov44mklmp7thp4nor83m.apps.googleusercontent.com&redirect_uri=https://youthful-ride-6b8f93.netlify.app/signin&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email"
        >
          <i className="fab fa-google"></i>
          Google로 로그인
        </OauthButton>
        <OauthButton
          onClick={() => {
            localStorage.setItem("socialType", "github");
          }}
          href="https://github.com/login/oauth/authorize?client_id=1caba106b0f779b40cc8&scope=user:email"
        >
          <i className="fab fa-github"></i>
          Github로 로그인
        </OauthButton>
      </ButtonContainer>
    </Container>
  );
};

export default Signin;
