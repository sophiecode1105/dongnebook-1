import styled from "styled-components";
import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import {
  currentaddress,
  currentLocationStorage,
  loginState,
  mapResultsStorage,
  searchLocation,
  storeContentId,
} from "../../state/state";
import Swal from "sweetalert2";
import Map from "../Book/Map";
import { getSingleBookInfo, patchContent } from "../../api";
import MobileModify from "./MobileModify";

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

type isPcProps = {
  isPc: boolean;
};

const Form = styled.form<isPcProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 100%;
  width: ${(props) => (props.isPc ? "80%" : "100%")};
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
//file???????????? file????????? ???????????? ???????????????.
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
  const [currentLocation, setCurrentLocation] = useRecoilState(currentLocationStorage);

  const [modifyLatitu, setModifyLatitu] = useState();
  const [modifyLongtitu, setModifyLongtitu] = useState();

  const mapSearchResults = useRecoilValue(mapResultsStorage);
  const token = useRecoilValue(loginState);
  const address = useRecoilValue(currentaddress);
  const navigate = useNavigate();
  const id = useRecoilValue(storeContentId);
  const [modifyquality, setModifyQuality] = useState<string>("");
  const pageChange = Number(localStorage.getItem("modify_id"));

  const side = useRef<HTMLDivElement>(null);
  const isPc = useMediaQuery({ query: "(min-width: 768px)" }, undefined);

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
      const { productInfo } = await getSingleBookInfo(id, token);
      setValue("title", productInfo.title);
      setValue("content", productInfo.content);
      const radiobuttonValue = document.getElementById(productInfo.quality) as HTMLInputElement;
      radiobuttonValue.checked = true;
      setModifyQuality(productInfo.quality);
      let modifyImg = productInfo.images;
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
      setModifyLatitu(productInfo.locations.lat);
      setModifyLongtitu(productInfo.locations.lon);
    },
    [setValue, token]
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
      formData.append("lat", String(currentLocation.y));
      formData.append("lon", String(currentLocation.x));
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

  useEffect(() => {
    return () => {
      setCurrentLocation({ addressName: "", x: 0, y: 0 });
    };
  }, [setCurrentLocation]);

  return (
    <Container>
      <Form isPc={isPc} onSubmit={handleSubmit(onSubmit)}>
        {isPc ? (
          <>
            {" "}
            <TitleBox>
              <Title>????????? ??????</Title>
            </TitleBox>
            <UploadInform>
              <InformBox>
                <InformTitle>??????</InformTitle>
              </InformBox>
              <Uploads>
                <InputBox>
                  <Input
                    type="text"
                    placeholder="???????????? ??????????????????."
                    error={errors.title?.message}
                    {...register("title", {
                      required: "????????? ??????????????????",
                      maxLength: { value: 20, message: "?????? 20??? ????????? ??????????????????" },
                    })}
                  />
                  <Errorbox>{errors.title?.message}</Errorbox>
                </InputBox>
                <TitleLength>{title === undefined ? "0/20" : `${title.length}/20`}</TitleLength>
              </Uploads>
            </UploadInform>
            <UploadInform>
              <InformBox>
                <InformTitle>??????</InformTitle>
              </InformBox>
              <Uploads>
                <InputBox>
                  <CheckBoxWrap>
                    <CheckBox type="radio" id="???????????????" value="???????????????" {...register("quality")}></CheckBox>
                    <Checklabel htmlFor="???????????????">???????????????</Checklabel>
                    <CheckBox type="radio" id="????????????" value="????????????" {...register("quality")}></CheckBox>
                    <Checklabel htmlFor="????????????w">????????????</Checklabel>
                    <CheckBox type="radio" id="????????????" value="????????????" {...register("quality")}></CheckBox>
                    <Checklabel htmlFor="????????????">????????????</Checklabel>
                  </CheckBoxWrap>
                  <Errorbox>{errors.quality?.message}</Errorbox>
                </InputBox>
              </Uploads>
            </UploadInform>
            <UploadInform>
              <InformBox>
                <InformTitle>??????</InformTitle>
              </InformBox>
              <Uploads>
                <InputBox>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Label htmlFor="input_file">
                      <i className="fas fa-camera"></i>
                      <ImgTitle>????????? ?????????</ImgTitle>
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
                                  text: "??????????????? ?????? 3????????? ???????????????",
                                  confirmButtonText: "??????",
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
                <InformTitle>??????</InformTitle>
              </InformBox>
              <Uploads>
                <InputBox>
                  <Textarea
                    placeholder="?????? ????????? ??????????????????.(10????????????)"
                    error={errors.content?.message}
                    {...register("content", {
                      required: "?????? ????????? ??????????????????.",
                      minLength: { value: 10, message: "?????? ????????? 10??? ?????? ??????????????????" },
                      maxLength: { value: 500, message: "?????? ????????? 500??? ?????? ??????????????????" },
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
                <InformTitle>??????</InformTitle>
              </InformBox>
              <Uploads>
                <LocationWrap>
                  <SearchContainer>
                    <SearchBox>
                      <SearchBar type="text" placeholder="??????,?????? ??????" {...register("location")}></SearchBar>
                      <SearchButton type="button" onClick={searchPlace}>
                        <i className="fas fa-search"></i>
                      </SearchButton>
                    </SearchBox>
                    {isOpen ? (
                      <SearchResultBox ref={side}>
                        {mapSearchResults.map((searchResult: any, key) => {
                          return (
                            <SearchResult
                              key={key}
                              onClick={() => {
                                setIsOpen(!isOpen);
                                setCurrentLocation(searchResult);
                                setModifyLatitu(searchResult.y);
                                setModifyLongtitu(searchResult.x);
                              }}
                            >
                              {searchResult?.address_name}
                            </SearchResult>
                          );
                        })}
                      </SearchResultBox>
                    ) : null}
                  </SearchContainer>
                  {modifyLatitu && modifyLongtitu ? <Map mapLat={modifyLatitu} mapLong={modifyLongtitu} /> : null}
                </LocationWrap>
              </Uploads>
            </UploadInform>
            <ButtonBox>
              <CancelButton to={`/search/${pageChange}`}>??????</CancelButton>
              <RegisterButton type="submit">??????</RegisterButton>
            </ButtonBox>
          </>
        ) : (
          <MobileModify
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            convertManyFilesToURL={convertManyFilesToURL}
            register={register}
            imageStore={imageStore}
            setImageStore={setImageStore}
            errors={errors}
            radio={
              <>
                <CheckBox type="radio" id="???????????????" value="???????????????" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="???????????????">???????????????</Checklabel>
                <CheckBox type="radio" id="????????????" value="????????????" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="????????????w">????????????</Checklabel>
                <CheckBox type="radio" id="????????????" value="????????????" {...register("quality")}></CheckBox>
                <Checklabel htmlFor="????????????">????????????</Checklabel>
              </>
            }
            mapProps={
              <LocationWrap>
                <SearchContainer>
                  <SearchBox>
                    <SearchBar type="text" placeholder="??????,?????? ??????" {...register("location")}></SearchBar>
                    <SearchButton type="button" onClick={searchPlace}>
                      <i className="fas fa-search"></i>
                    </SearchButton>
                  </SearchBox>
                  {isOpen ? (
                    <SearchResultBox ref={side}>
                      {mapSearchResults.map((searchResult: any, key) => {
                        return (
                          <SearchResult
                            key={key}
                            onClick={() => {
                              setIsOpen(!isOpen);
                              setCurrentLocation(searchResult);
                              setModifyLatitu(searchResult.y);
                              setModifyLongtitu(searchResult.x);
                            }}
                          >
                            {searchResult?.address_name}
                          </SearchResult>
                        );
                      })}
                    </SearchResultBox>
                  ) : null}
                </SearchContainer>
                {modifyLatitu && modifyLongtitu ? <Map mapLat={modifyLatitu} mapLong={modifyLongtitu} /> : null}
              </LocationWrap>
            }
            button={
              <ButtonBox>
                <CancelButton to="/search">??????</CancelButton>
                <RegisterButton type="submit">??????</RegisterButton>
              </ButtonBox>
            }
          ></MobileModify>
        )}
      </Form>
    </Container>
  );
};

export default Modify;
