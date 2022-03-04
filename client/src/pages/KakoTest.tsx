import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getLocationList } from "../api";
import { loginState, searchData } from "../state/state";
import iconblack from "../img/iconblack.png";
import iconcolor from "../img/iconred.png";
import greenbook from "../img/greenbook.gif";
import LocationSearchBar from "../components/Search/LocationSearchBar";
declare global {
  interface Window {
    kakao: any;
  }
}

const Containter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Map = styled.div<{ isLoading: boolean }>`
  border-radius: 10px;
  border: 1px green solid;
  width: 100%;
  height: 500px;
  display: flex;
  margin: auto;
  visibility: ${(props) => (props.isLoading ? "collapse" : "visible")};
`;
const LockPosition = styled.div`
  position: relative;
`;

export const KakaoTest = () => {
  let place: any = useRef(null);
  const keywords = useRef<HTMLInputElement>(null);
  const markers = useRef([]);
  const markered = useRef(null);
  const productLocations: any = useRef(null);
  const searchList = useSetRecoilState(searchData);
  const Nav = useNavigate();
  const token = useRecoilValue(loginState);
  const [isLoading, setIsLoading] = useState(true);

  function searchPlaces(type: any, clickEl: any) {
    const keyword = clickEl ? clickEl : keywords.current?.value;
    const ps = new window.kakao.maps.services.Places();

    if (!keyword?.replace(/^\s+|\s+$/g, "")) {
      searchList([]);
      return false;
    }

    ps.keywordSearch(keyword, (data: any) => {
      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      const bounds = new window.kakao.maps.LatLngBounds();
      searchList(data);
      for (let i = 0; i < data.length; i++) {
        let placePosition = new window.kakao.maps.LatLng(data[i].y, data[i].x);
        bounds.extend(placePosition);
      }
      if (type) {
        place.current.setBounds(bounds);
        markers.current = getTarget(
          place.current.getCenter(),
          place.current,
          markers.current,
          markered.current
        );
      }
    });
  }

  const getTarget = useCallback(
    (centerPosition: any, map: any, markers: any, marker: any) => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].marker.setMap(null);
      }

      markers = [];
      const drawingLine = new window.kakao.maps.Polyline(); // 그려지고 있는 원의 반지름을 표시할 선 객체입니다
      marker.setPosition(centerPosition); // 마커 위치를 클릭한 위치로 옮깁니다
      for (let i = 0; i < productLocations?.current.length; i++) {
        const productImg = productLocations?.current[i].images[0].url;
        let productPosition = new window.kakao.maps.LatLng(
          productLocations?.current[i]["locations"]["lat"],
          productLocations?.current[i]["locations"]["lon"]
        );

        const linePath = [centerPosition, productPosition]; // 그려지고 있는 선을 표시할 선 객체에 좌표 배열을 설정합니다
        drawingLine.setPath(linePath);
        const length = drawingLine.getLength();
        const imageSize = new window.kakao.maps.Size(65, 65); //   마커 이미지를 생성합니다
        const markerImage = new window.kakao.maps.MarkerImage(iconblack, imageSize);

        if (length < 400) {
          let marker = new window.kakao.maps.Marker({
            map, // 마커를 표시할 지도
            position: productPosition, // 마커를 표시할 위치
            title: productLocations?.current[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage,
          });
          const productInfo = productLocations?.current[i];

          const iwContent = ` <img width=150px height = 300px src = "${productImg}"/><div style="padding:5px;" >${productInfo.title}</div><div style="padding:5px;" >${productInfo.locations.address}</div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

          const infowindow = new window.kakao.maps.InfoWindow({
            // 인포윈도우를 생성합니다
            position: productPosition,
            content: iwContent,
          });

          marker.setMap(map); //   마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
          markers.push({ marker, infowindow, productInfo });
        }

        if (length > 0) {
          drawingLine.setMap(null);
        }
      }

      markers.forEach((data: any) => {
        const { marker, infowindow, productInfo } = data;
        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          //   마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
          //   마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
          Nav(`/search/${productInfo.id}`);
        });

        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          //   마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
          infowindow.close();
        });
      });

      return markers;
    },
    [Nav]
  );

  const setInfo: any = useMemo(async () => {
    return await getLocationList(token);
  }, [token]);

  function naviInfo() {
    return new Promise((resolve, rejected) => {
      navigator.geolocation.getCurrentPosition(resolve, rejected);
    });
  }

  const getData = useCallback(async () => {
    let userLocation: any;

    await setInfo.then((res: any) => {
      userLocation = res.userLocation;
      productLocations.current = res.productLocation;
    });
    let center;
    try {
      const allowLocation: any = await naviInfo();
      if (allowLocation) {
        center = new window.kakao.maps.LatLng(
          allowLocation.coords.latitude,
          allowLocation.coords.longitude
        );
      }
    } catch (e) {
      center = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lon);
    }
    const options = {
      center, //지도의 중심좌표.
      level: 4, //지도의 레벨(확대, 축소 정도)
    };

    let map = new window.kakao.maps.Map(place.current, options);
    place.current = map;

    const imageSize = new window.kakao.maps.Size(40, 40); //   마커 이미지를 생성합니다
    const markerImage = new window.kakao.maps.MarkerImage(iconcolor, imageSize);
    const marker = new window.kakao.maps.Marker({
      // 지도 중심좌표에 마커를 생성합니다
      image: markerImage,
      position: map.getCenter(),
    });

    markered.current = marker;
    marker.setMap(map); // 지도에 마커를 표시합니다

    markers.current = getTarget(center, map, markers.current, marker);

    window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
      markers.current = getTarget(mouseEvent.latLng, map, markers.current, marker);
    });
    setIsLoading(false);
  }, [getTarget, setInfo]);

  useEffect(() => {
    getData();
  }, [getData]);
  console.log(isLoading);
  return (
    <Containter>
      <div className="pt-20 max-w-md w-full m-auto p-2 h-full">
        <h1 className="text-2xl font-bold pb-3 border-b-2 border-[#7F7F7F] mb-3">
          내 주변 도서 찾기
        </h1>
        <LockPosition>
          <LocationSearchBar keywords={keywords} searchPlaces={searchPlaces} />
          {isLoading && <img src={greenbook} alt="" />}
          <Map ref={place} isLoading={isLoading} />
        </LockPosition>
      </div>
    </Containter>
  );
};
