import styled from "styled-components";
import { useState } from "react";
import { useForm, ValidationRule } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const DisplayRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DisplayColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const Wrap = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const Container = styled(DisplayColumn)`
  height: 100vh;
  width: 100%;
  padding-top: 120px;
  max-width: 1200px;
`;

const Form = styled(DisplayColumn)`
  width: 80%;
  height: 100%;
  padding: 20px;
`;

const TitleBox = styled.div`
  width: 100%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const UploadInform = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 20px 0px;
`;

const InformBox = styled.div`
  display: flex;
  width: 20%;
`;

const InformTitle = styled.div`
  /* border: 1px solid blue; */
  min-width: 100px;
  font-size: 18px;
  color: #363636f0;
`;

const ImageCount = styled.div`
  color: #949393;
  border: 1px solid pink;
  margin-left: 5px;
`;

const Uploads = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
`;

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;

  width: 150px;
  height: 150px;
  border: 1px solid #dcdbe3;
  background-color: #fafafd;
  i {
    font-size: 30px;
    color: #dcdbe3;
  }
`;

const ImgFile = styled.input`
  text-decoration: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  font-size: 0;
  opacity: 0;
`;

interface ErrorProps {
  error: string | undefined;
}

const Input = styled.input<ErrorProps>`
  text-decoration: none;
  border: 1px solid ${(props) => (props.error ? "red" : "rgba(0, 0, 0, 0.2)")};
  width: 100%;
  padding: 8px;
  &:focus {
    outline: none;
  }
`;

const Errorbox = styled.div`
  color: red;
  font-weight: bold;
  font-size: 12px;
  padding-left: 5px;
`;

const TitleLength = styled(DisplayRow)`
  width: 8%;
  text-align: right;
  margin: 0px 10px 0px 20px;
`;

const Textarea = styled.textarea<ErrorProps>`
  height: 200px;
  width: 95%;
  border: 1px solid ${(props) => (props.error ? "red" : "rgba(0, 0, 0, 0.2)")};
  &:focus {
    outline: none;
  }
`;

const ButtonBox = styled(DisplayRow)`
  width: 100%;

  /* border: 2px solid purple; */
`;

const BookImg = styled.img`
  /* margin: 15px; */
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* height: 150px; */
  /* border: 1px solid #dcdbe3; */
`;

const ImgTitle = styled.div`
  color: #b2b0b0;
`;

const Button = styled.button`
  min-width: 100px;
  width: 20%;
  height: 50px;
  cursor: pointer;
  font-size: 20px;
  border: 0;
  outline: 0;
  color: rgb(242, 242, 242, 0.9);
  font-weight: 500;
  margin: 30px 30px;
`;

const RegisterButton = styled(Button)`
  background-color: #2f6218;
  &:hover {
    background-color: rgba(47, 98, 24, 0.8);
  }
`;
const CancelButton = styled(Button)`
  background-color: #b2b0b0;
  &:hover {
    background-color: rgba(178, 176, 176, 0.8);
  }
`;

const Count = styled.div`
  margin-top: 10px;
`;

const CheckBox = styled.input`
  margin-right: 10px;
`;

const Checklabel = styled.label`
  /* border: 1px solid red; */
  margin-right: 10px;
  color: grey;
`;

//file받아오고 file수만큼 이미지를 만들어준다.
type FormData = {
  img: FileList;
  title: string;
  content: string;
  quality: string;
};

const Upload = () => {
  const [imgList, setImgList] = useState<string[]>([]);

  const {
    register,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });
  const { title } = watch();
  const { content } = watch();

  console.log(content);

  return (
    <Container>
      <Form>
        <TitleBox>
          <Title>도서 등록</Title>
        </TitleBox>
        <UploadInform>
          <InformBox>
            <InformTitle>제목</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <Input
                type="text"
                placeholder="도서명을 입력해주세요."
                error={errors.title?.message}
                {...register("title", {
                  minLength: { value: 2, message: "최소 2자 이상 입력해주세요" },
                  maxLength: { value: 20, message: "최대 20자 이하로 입력해주세요" },
                })}
              />
              <Errorbox>{errors.title?.message}</Errorbox>
            </InputBox>
            <TitleLength>{title === undefined ? "0/20" : `${title.length}/20`}</TitleLength>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>상태</InformTitle>
          </InformBox>
          <Uploads>
            <CheckBox type="radio" name="check" id="new"></CheckBox>
            <Checklabel htmlFor="new">새상품같음</Checklabel>
            <CheckBox type="radio" name="check" id="notnew"></CheckBox>
            <Checklabel htmlFor="notnew">약간헌책</Checklabel>
            <CheckBox type="radio" name="check" id="dirty"></CheckBox>
            <Checklabel htmlFor="dirty">많이헌책</Checklabel>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>사진</InformTitle>
          </InformBox>
          <Uploads>
            <div
              style={{
                // border: "1px solid blue",
                display: "flex",
                // border: "1px solid blue",
                alignItems: "stretch",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Label htmlFor="input_file">
                <i className="fas fa-camera"></i>
                <ImgTitle>이미지 업로드</ImgTitle>
                <ImgFile
                  id="input_file"
                  type="file"
                  accept="image/*"
                  placeholder="도서명을 입력해주세요."
                  multiple
                  {...register("img", {
                    onChange: (event) => {
                      let files = event.target.files;
                      if (imgList.length >= 3) {
                        return alert("사진 첨부는 최대 3장까지 가능합니다.");
                      }
                      if (files && files.length) {
                        for (let i = 0; i < files.length; i++) {
                          let reader = new FileReader();
                          reader.onload = function () {
                            setImgList((prev) => [...prev, String(reader.result)]);
                          };
                          reader.readAsDataURL(files[i]); // loadre\\ //////// <><><><><><><<>
                        }
                      }
                    },
                  })}
                />
              </Label>
              {imgList.map((url) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      border: "1px solid black",
                      width: "150px",
                      height: "150px",
                      padding: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "20px",
                      // margin: "10px",
                    }}
                  >
                    <BookImg src={url}></BookImg>
                  </div>
                );
              })}
            </div>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>설명</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <Textarea
                placeholder="상품 설명을 입력해주세요.(10글자이상)"
                error={errors.content?.message}
                {...register("content", {
                  minLength: { value: 10, message: "상품 설명을 10자 이상 입력해주세요" },
                  maxLength: { value: 500, message: "상품 설명을 500자 이하 입력해주세요" },
                })}
              />
              <Wrap>
                <Errorbox>{errors.content?.message}</Errorbox>
                <Count>{content === undefined ? "0/200" : `${content.length}/500`}</Count>
              </Wrap>
            </InputBox>
          </Uploads>
        </UploadInform>
        <ButtonBox>
          <CancelButton>취소</CancelButton>
          <RegisterButton>다음</RegisterButton>
        </ButtonBox>
      </Form>
    </Container>
  );
};

export default Upload;
