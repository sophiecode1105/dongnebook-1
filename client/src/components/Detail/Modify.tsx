import styled from "styled-components";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { Link, useNavigate } from "react-router-dom";
import {
  currentaddress,
  currentLatitude,
  currentLocationStorage,
  currentLongtitude,
  loginState,
  mapResultsStorage,
  modifyLatitude,
  modifyLongtitude,
  searchLocation,
  storeContentId,
} from "../../state/state";
import Swal from "sweetalert2";
import Map from "../Book/Map";
import { getSingleBookInfo, patchContent } from "../../api";

declare global {
  interface Window {
    kakao: any;
  }
}

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
  justify-content: center;
  width: 100%;
  padding-top: 66px;
  max-width: 1400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  height: 100%;
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
  min-width: 100px;
  font-size: 18px;
  color: #363636f0;
  padding: 0px 0px 0px 10px;
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
  z-index: 1;

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

const ImgMapList = styled.div`
  display: flex;
  border: 1px solid #dcdbe3;
  width: 150px;
  height: 150px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
`;

interface ErrorProps {
  error: string | undefined;
}

const Input = styled.input<ErrorProps>`
  text-decoration: none;
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  width: 100%;
  padding: 8px;
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
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
  border: ${(props) => (props.error ? "2px solid red" : "1px solid rgba(0,0,0,0.2)")};
  &:focus {
    outline-color: ${(props) => (props.error ? "red" : "green")};
  }
`;

const ButtonBox = styled(DisplayRow)`
  width: 100%;
`;

const BookImg = styled.img`
  width: 100%;
  max-height: 100%;
  object-fit: contain;
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
const CancelButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
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
  margin-right: 10px;
  color: grey;
`;
const LocationWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: reltative;
`;

const SearchBar = styled.input`
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 60%;
  padding: 8px;
  &:focus {
    outline-color: green;
  }
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
  padding: 0 15px;
  i {
    color: white;
    font-size: 18px;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  position: relative;
`;

const CheckBoxWrap = styled.div``;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
`;
const SearchResultBox = styled.div`
  position: absolute;
  width: 60%;
  z-index: 20;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const SearchResult = styled.div`
  background-color: white;
  padding: 2px;
  cursor: pointer;
`;
//file받아오고 file수만큼 이미지를 만들어준다.
type FormData = {
  img: FileList;
  title: string;
  content: string;
  quality: string;
  location: string;
  latitude: number;
  longtitude: number;
};

const Modify = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageStore, setImageStore] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [patchImageUrls, setPatchImageUrls] = useState<string[]>([]);
  const setLocation = useSetRecoilState(searchLocation);
  const setCurrentLocation = useSetRecoilState(currentLocationStorage);
  const modifyLat = useSetRecoilState(modifyLatitude);
  const modifyLon = useSetRecoilState(modifyLongtitude);

  const mapSearchResults = useRecoilValue(mapResultsStorage);
  const token = useRecoilValue(loginState);
  const latitude = useRecoilValue(currentLatitude);
  const longtitude = useRecoilValue(currentLongtitude);
  const address = useRecoilValue(currentaddress);
  const navigate = useNavigate();
  const id = useRecoilValue(storeContentId);
  const [modifyquality, setModifyQuality] = useState<string>("");
  const pageChange = Number(localStorage.getItem("modify_id"));

  const side = useRef<HTMLDivElement>(null);
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  const { title } = watch();
  const { content } = watch();

  const convertFileToURL = (file: File) => {
    return new Promise<string>((res, rej) => {
      const fileReader = new FileReader();
      fileReader.onerror = rej;
      fileReader.onload = () => {
        res(String(fileReader.result));
      };
      fileReader.readAsDataURL(file);
    });
  };

  const convertManyFilesToURL = async (files: FileList) => {
    let promises = [];
    for (let i = 0; i < files?.length; i++) {
      promises.push(convertFileToURL(files[i]));
    }
    try {
      return await Promise.all<string>(promises);
    } catch (e) {
      throw e;
    }
  };

  const getSingleData = useCallback(
    async (id: number) => {
      const data = await getSingleBookInfo(id, token);
      setValue("title", data.title);
      setValue("content", data.content);
      const radiobuttonValue = document.getElementById(data.quality) as HTMLInputElement;
      radiobuttonValue.checked = true;
      setModifyQuality(data.quality);
      let modifyImg = data.images;
      let imgData: any[] = [];
      for (let i = 0; i < modifyImg.length; i++) {
        imgData.push(modifyImg[i].url);
      }

      setPatchImageUrls((prev) => {
        return [...prev, ...imgData];
      });
      setImageUrls((prev) => {
        return [...prev, ...imgData];
      });
      modifyLat(data.locations.lat);
      modifyLon(data.locations.lon);
    },
    [modifyLat, modifyLon, setValue, token]
  );

  const patchData = async () => {
    return new Promise(async (res, rej) => {
      const { title, content, quality } = getValues();

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (imageStore) {
        for (let i = 0; i < imageStore.length; i++) {
          formData.append("file", imageStore[i]);
        }
      }

      for (let i = 0; i < patchImageUrls.length; i++) {
        formData.append("url", JSON.stringify({ url: patchImageUrls[i], productId: pageChange }));
      }

      if (quality === null) {
        formData.append("quality", modifyquality);
      } else {
        formData.append("quality", quality);
      }
      formData.append("lat", String(latitude));
      formData.append("lon", String(longtitude));
      formData.append("address", address);

      let status = await patchContent(Number(id), formData, token || "token");
      if (Number(status) < 300) {
        res(true);
      } else {
        rej(false);
      }
    });
  };

  const onSubmit = async () => {
    try {
      let successful = await patchData();
      if (successful) {
        navigate("/search", { replace: true });
      }
    } catch (e) {
      throw e;
    }
  };

  const searchPlace = async () => {
    setIsOpen(!isOpen);
    const { location } = getValues();
    setLocation(location);
  };

  const handleClickOutside = useCallback(
    (event: CustomEvent<MouseEvent>) => {
      if (isOpen && !side?.current?.contains(event.target as Node)) {
        setIsOpen(!isOpen);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    window.addEventListener("click", handleClickOutside as EventListener);
    return () => {
      window.removeEventListener("click", handleClickOutside as EventListener);
    };
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    let fetchID = id;
    if (fetchID === null) {
      fetchID = Number(localStorage.getItem("modify_id"));
    }
    getSingleData(fetchID);
    return () => {
      localStorage.removeItem("modify_id");
    };
  }, [getSingleData, id]);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TitleBox>
          <Title>게시글 수정</Title>
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
                  required: "제목을 입력해주세요",
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
            <InputBox>
              <CheckBoxWrap>
                <CheckBox type="radio" id="새상품같음" value="새상품같음" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="새상품같음">새상품같음</Checklabel>
                <CheckBox type="radio" id="약간헌책" value="약간헌책" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="약간헌책w">약간헌책</Checklabel>
                <CheckBox type="radio" id="많이헌책" value="많이헌책" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="많이헌책">많이헌책</Checklabel>
              </CheckBoxWrap>
              <Errorbox>{errors.quality?.message}</Errorbox>
            </InputBox>
          </Uploads>
        </UploadInform>
        <UploadInform>
          <InformBox>
            <InformTitle>사진</InformTitle>
          </InformBox>
          <Uploads>
            <InputBox>
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  width: "100%",
                }}>
                <Label htmlFor="input_file">
                  <i className="fas fa-camera"></i>
                  <ImgTitle>이미지 업로드</ImgTitle>
                  <ImgFile
                    id="input_file"
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("img", {
                      onChange: async (event) => {
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
              </div>
              <Errorbox>{errors.img?.message}</Errorbox>
            </InputBox>
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
                  required: "상품 설명을 입력해주세요.",
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
        <UploadInform>
          <InformBox>
            <InformTitle>위치</InformTitle>
          </InformBox>
          <Uploads>
            <LocationWrap>
              <SearchContainer>
                <SearchBox>
                  <SearchBar type="text" placeholder="건물,지역 검색" {...register("location")}></SearchBar>
                  <SearchButton type="button" onClick={searchPlace}>
                    <i className="fas fa-search"></i>
                  </SearchButton>
                </SearchBox>
                {isOpen ? (
                  <SearchResultBox ref={side}>
                    {mapSearchResults.map((searchResult: { address_name: string }, key) => {
                      return (
                        <SearchResult
                          key={key}
                          onClick={() => {
                            setIsOpen(!isOpen);
                            setCurrentLocation(searchResult);
                          }}>
                          {searchResult?.address_name}
                        </SearchResult>
                      );
                    })}
                  </SearchResultBox>
                ) : null}
              </SearchContainer>
              <Map />
            </LocationWrap>
          </Uploads>
        </UploadInform>
        <ButtonBox>
          <CancelButton to={`/search/${pageChange}`}>취소</CancelButton>
          <RegisterButton type="submit">수정</RegisterButton>
        </ButtonBox>
      </Form>
    </Container>
  );
};

export default Modify;
