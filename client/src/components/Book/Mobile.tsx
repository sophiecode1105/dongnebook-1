import styled from "styled-components";
import Swal from "sweetalert2";
import { UseFormRegister } from "react-hook-form";

const LabelWrap = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: 350px;
  margin: 20px 0px 20px 20px;
`;

const LineBorder = styled.div`
  width: 92%;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 70px;
  height: 70px;
  border: 1px solid #dcdbe3;
  background-color: #fafafd;
  i {
    font-size: 25px;
    color: #dcdbe3;
  }
`;

const ImgTitle = styled.div`
  color: #b2b0b0;
  font-size: 12px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
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

const ImgMapList = styled.div`
  display: flex;
  border: 1px solid #dcdbe3;
  width: 70px;
  height: 70px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
`;

const BookImg = styled.img`
  width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

interface ErrorProps {
  error: string | undefined;
}

const Input = styled.input<ErrorProps>`
  text-decoration: none;
  width: 90%;
  padding: 10px;
  margin: 5px;
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

const RadioWrap = styled.div`
  margin: 10px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 85%;
`;

const Textarea = styled.textarea<ErrorProps>`
  height: 240px;
  width: 90%;
  padding: 10px;
  margin: 10px;
  /* border: 1px solid red; */
  &:focus {
    outline: none;
  }
`;

type FormData = {
  img: FileList;
  title: string;
  content: string;
  quality: string;
  location: string;
  latitude: number;
  longtitude: number;
};

const Mobile = ({
  imageUrls,
  setImageUrls,
  convertManyFilesToURL,
  register,
  imageStore,
  setImageStore,
  errors,
  radio,
}: {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  convertManyFilesToURL: any;
  register: UseFormRegister<FormData>;
  imageStore: any[];
  setImageStore: React.Dispatch<React.SetStateAction<any[]>>;
  errors: any;
  radio: JSX.Element;
}) => {
  return (
    <>
      <LabelWrap>
        <Label htmlFor="input_file">
          <i className="fas fa-camera"></i>
          <ImgTitle>이미지 업로드</ImgTitle>
          <ImgFile
            id="input_file"
            type="file"
            accept="image/*"
            multiple
            {...register("img", {
              onChange: async (event: any) => {
                let files = event.target.files;
                if (files && files.length) {
                  if (imageUrls.length > 2) {
                    return Swal.fire({
                      text: "사진첨부는 최대 3장까지 가능합니다",
                      confirmButtonText: "확인",
                      confirmButtonColor: "#2f6218",
                      icon: "warning",
                    });
                  }
                  let urls = await convertManyFilesToURL(files);
                  setImageUrls((prev) => {
                    return [...prev, ...urls];
                  });
                  setImageStore([...imageStore, ...files]);
                }
              },
            })}
          />
        </Label>
        {imageUrls.map((url, key) => {
          return (
            <ImgMapList key={key}>
              <BookImg src={url}></BookImg>
            </ImgMapList>
          );
        })}
      </LabelWrap>
      <LineBorder />
      <Input
        type="text"
        placeholder="도서명을 입력해주세요."
        error={errors.title?.message}
        {...register("title", {
          maxLength: { value: 20, message: "최대 20자 이하로 입력해주세요" },
        })}
      />
      <LineBorder />
      <Errorbox>{errors.title?.message}</Errorbox>
      <RadioWrap>{radio}</RadioWrap>
      <LineBorder />
      <Textarea
        placeholder="상품 설명을 입력해주세요.(10글자이상)"
        error={errors.content?.message}
        {...register("content", {
          minLength: { value: 10, message: "상품 설명을 10자 이상 입력해주세요" },
          maxLength: { value: 500, message: "상품 설명을 500자 이하 입력해주세요" },
        })}
      />
      <LineBorder />
      <Errorbox>{errors.content?.message}</Errorbox>
    </>
  );
};

export default Mobile;
