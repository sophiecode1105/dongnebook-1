import { UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import Swal from "sweetalert2";
import Mobile from "./Mobile";

const TitleBox = styled.div`
  width: 93%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const Title = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const MapBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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

const MobileUpload = ({
  imageUrls,
  setImageUrls,
  convertManyFilesToURL,
  register,
  imageStore,
  setImageStore,
  errors,
  radio,
  mapProps,
  button,
}: {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  convertManyFilesToURL: any;
  register: UseFormRegister<FormData>;
  imageStore: any[];
  setImageStore: React.Dispatch<React.SetStateAction<any[]>>;
  errors: any;
  radio: JSX.Element;
  mapProps: JSX.Element;
  button: JSX.Element;
}) => {
  return (
    <>
      <TitleBox>
        <Title>도서 등록</Title>
      </TitleBox>
      <Mobile
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        convertManyFilesToURL={convertManyFilesToURL}
        register={register}
        imageStore={imageStore}
        setImageStore={setImageStore}
        errors={errors}
        radio={radio}
      />
      <MapBox>
        {mapProps}
        {button}
      </MapBox>
    </>
  );
};

export default MobileUpload;
