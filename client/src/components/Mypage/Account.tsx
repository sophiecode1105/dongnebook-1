import { useEffect, useState } from "react";
import styled from "styled-components";
import { patchAccount, postNickcheck } from "../../api";
import { ErrorProps, Nickprops } from "../../state/typeDefs";
import { useForm, ValidationRule } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { loginState, userState } from "../../state/state";
import lock from "../../img/lock.png";
import lockcheck from "../../img/lockcheck.png";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

declare global {
  interface Window {
    kakao: any;
  }
}

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
    div {
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
  object-fit: cover;
  cursor: pointer;
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
  width: 100%;
  display: flex;
  margin-bottom: 3px;
  color: grey;
  font-weight: bold;
`;

const Input = styled.input<ErrorProps>`
  padding: 20px 20px;
  font-size: 15px;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const NarrowInput = styled(Input)`
  width: 80%;
`;

const Email = styled.div`
  width: 100%;
  padding: 20px 20px;
  font-size: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
`;

const WideInput = styled(Input)`
  width: 100%;
`;

const Errorbox = styled.div<Nickprops>`
  color: ${(props) => (props.nickValid ? "green" : "red")};
  margin-bottom: 15px;
  font-weight: bold;
  font-size: 12px;
`;

const Button = styled.button`
  height: 60px;
  cursor: pointer;
  background-color: #2f6218;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;

const NarrowButton = styled(Button)`
  font-size: 15px;
  transition: 0.3s;
  padding: 0 5px;
`;

const Buttonbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
`;

const RegisterButton = styled(Button)`
  width: 47%;
  font-size: 20px;
  height: 50px;
`;
const CancelButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 47%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  background-color: #b2b0b0;
  &:hover {
    background-color: rgba(178, 176, 176, 0.8);
  }
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
const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchButton = styled.button`
  cursor: pointer;
  background-color: #2f6218;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
  font-size: 15px;
  transition: 0.3s;
  padding: 0 20px;
  margin: 0 0 0 15px;
  i {
    color: white;
    font-size: 18px;
  }
`;
const Img = styled.img`
  position: absolute;
  top: 15px;
  right: 3px;
  width: 38px;
  height: 38px;
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
`;

type FormData = {
  email: string;
  nick: string;
  password: string;
  password2: string;
  address: string;
  image: FileList;
  location: string;
};

const Account = () => {
  const user = useRecoilValue(userState);
  const { img, nickname, email, locations } = user;
  const [nickCheck, setNickCheck] = useState("");
  const [nickValid, setNickValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchResult, setSearchResult] = useState(locations?.address);
  const [latitude, setLattitude] = useState(locations?.lat);
  const [longtitude, setLongtitude] = useState(locations?.lon);
  const [avatarImg, setAvatarImg] = useState<string | undefined>(img);
  const token = useRecoilValue(loginState);
  const navigate = useNavigate();

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const getNick = async () => {
    let formVerified = await trigger("nick");
    if (formVerified) {
      const { nick } = getValues();
      if (nick === nickname) {
        setNickValid(true);
        setNickCheck("현재 사용중인 닉네임입니다");
        return;
      }
      let valid = await postNickcheck({ nickname: nick });
      if (valid) {
        setNickValid(true);
        setNickCheck("사용 가능한 닉네임입니다");
      } else {
        setNickValid(false);
        setNickCheck("이미 사용중인 닉네임입니다");
        setValue("nick", "");
      }
    }
  };

  const searchPlace = async () => {
    setIsOpen(!isOpen);
    const { location } = getValues();

    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(location, async (result: any, status: any) => {
      let address = result[0].address_name;
      let pattern = /[^(가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z\s)]/gi;
      let village = address.replace(pattern, "");
      setSearchResult(village);
      setLattitude(result[0].x);
      setLongtitude(result[0].y);
      if (village) {
        let alert = await Swal.fire({
          text: `${village}`,
          confirmButtonText: "확인",
          confirmButtonColor: "#2f6218",
          denyButtonText: "취소",
          denyButtonColor: "#b2b0b0",
          showDenyButton: true,
          reverseButtons: true,
          icon: "question",
        });
        if (alert.isConfirmed) {
          setValue("location", village);
        } else if (alert.isDenied) {
          setValue("location", "");
        }
      }
    });
  };

  const patchData = async () => {
    return new Promise(async (res, rej) => {
      const { nick, password, image } = getValues();
      const formData = new FormData();
      formData.append("email", email);
      formData.append("nickname", nick);
      formData.append("password", password);
      formData.append("file", image[0]);
      formData.append("address", searchResult);
      formData.append("lat", String(latitude));
      formData.append("lon", String(longtitude));
      let result = await patchAccount(formData, token || "token");
      if (result) {
        res(true);
      } else {
        rej(false);
      }
    });
  };

  const onSubmit = async () => {
    if (nickCheck === "") {
      Swal.fire({
        text: "닉네임 중복확인이 필요합니다",
        confirmButtonText: "확인",
        confirmButtonColor: "#2f6218",
        icon: "warning",
      });
      return;
    }
    try {
      let successful = await patchData();
      if (successful) {
        navigate("/mypage", { replace: true });
      }
    } catch (e) {
      throw e;
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarImg(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const nickPattern: ValidationRule<RegExp> = {
    value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/,
    message: "숫자, 영어, 한글만 입력해주세요",
  };

  const passwordPattern: ValidationRule<RegExp> = {
    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    message: "8자이상 / 영문 / 숫자 / 특수문자를 조합해주세요",
  };

  useEffect(() => {
    setValue("nick", nickname);
    setValue("location", locations?.address);
    setAvatarImg(img);
  }, [img, locations?.address, nickname, setValue]);

  return (
    <Container>
      <TitleBox>
        <Title>회원정보 수정</Title>
      </TitleBox>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="input_file">
          <Text>
            이미지 <br />
            업로드
          </Text>
          <UserAvatar src={avatarImg} />
          <ImgFile
            id="input_file"
            type="file"
            accept="image/*"
            multiple
            {...register("image", {
              onChange: async (event) => {
                let file = event.target.files[0];
                if (file) {
                  await previewFile(file);
                }
              },
            })}
          />
        </Label>
        <InputLabel>이메일(변경불가)</InputLabel>
        <Email>{email}</Email>
        <InputLabel>닉네임</InputLabel>
        <Wrap>
          <NarrowInput
            type="text"
            error={errors.nick?.message}
            onClick={() => {
              setValue("nick", "");
            }}
            {...register("nick", {
              required: "닉네임을 입력해주세요",
              pattern: nickPattern,
              minLength: { value: 2, message: "최소 2자 이상 입력해주세요" },
              maxLength: { value: 8, message: "최대 8자 이하로 입력해주세요" },
              onChange: () => {
                setNickValid(false);
                setNickCheck("");
              },
              shouldUnregister: true,
            })}
          />
          <NarrowButton type="button" onClick={getNick}>
            중복확인
          </NarrowButton>
        </Wrap>
        <Errorbox nickValid={nickValid}>{errors.nick?.message ? errors.nick.message : nickCheck}</Errorbox>
        <InputLabel>동네 설정</InputLabel>
        <SearchBox>
          <NarrowInput
            type="text"
            onClick={() => {
              setValue("location", "");
            }}
            placeholder="구, 동명으로 검색(ex. 서초구 서초동)"
            error={errors.location?.message}
            {...register("location")}
          />
          <SearchButton type="button" onClick={searchPlace}>
            <i className="fas fa-search"></i>
          </SearchButton>
        </SearchBox>
        <Errorbox>{errors.location?.message}</Errorbox>
        <InputLabel>비밀번호</InputLabel>
        <InputContainer>
          <WideInput
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              pattern: passwordPattern,
            })}
          />
          <Img src={lock} />
        </InputContainer>
        <Errorbox>{errors.password?.message}</Errorbox>
        <InputLabel>비밀번호 재확인</InputLabel>
        <InputContainer>
          <WideInput
            type="password"
            error={errors.password2?.message}
            {...register("password2", {
              required: "비밀번호를 입력해주세요",
              validate: {
                matchPassword: (value) => {
                  const { password } = getValues();
                  return password === value || "비밀번호가 일치하지 않습니다.";
                },
              },
            })}
          />
          <Img src={lockcheck} />
        </InputContainer>
        <Errorbox>{errors.password2?.message}</Errorbox>

        <Buttonbox>
          <CancelButton to="/mypage">취소</CancelButton>
          <RegisterButton type="submit">수정</RegisterButton>
        </Buttonbox>
      </Form>
    </Container>
  );
};

export default Account;
