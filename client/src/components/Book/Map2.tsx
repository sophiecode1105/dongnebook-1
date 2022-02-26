import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getLocationList } from "../../api";
import {
  currentLocationStorage,
  loginState,
  modifyLatitude,
  modifyLongtitude,
} from "../../state/state";

declare global {
  interface Window {
    kakao: any;
  }
}

export const Map2 = () => {
  const lat = useRecoilValue(modifyLatitude);
  const lon = useRecoilValue(modifyLongtitude);

  const Container = styled.div`
    width: 500px;
    height: 500px;
  `;

  let place = useRef(null);

  const clickLatlng = useRef<HTMLInputElement>(null);
  const keywords = useRef<HTMLInputElement>(null);
  const markers = useRef([]);
  const markered = useRef(null);
  const productLocations = useRef(null);
  const userLocations = useRef({ lat: 0, lon: 0 });
  const Nav = useNavigate();
  const token = useRecoilValue(loginState);

  const searchResult = useRecoilValue(currentLocationStorage);
  const searchMap = useRef(null);

  function searchPlaces(map: any) {
    const keyword = keywords.current?.value;
    var ps = new window.kakao.maps.services.Places();
    if (!keyword?.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, (data: any, status: any) => {
      if (status !== "OK") {
        alert("일시적 에러입니다. 잠시후 다시 시도해주세요!");
      }
      const bounds = new window.kakao.maps.LatLngBounds(); // 좌표계에서 사각영역 정보를 표현하는 객체 생성
      for (let i = 0; i < data.length; i++) {
        const placePosition = new window.kakao.maps.LatLng(data[i].y, data[i].x);
        bounds.extend(placePosition); // 인수로 주어진 좌표를 포함하도록 영역 정보를 확장
      }
      map.setBounds(bounds); // 검색된 장소 위치를 기준을 지도 범위 재설정

      markers.current = getTarget(
        map.getCenter(),
        map,
        markers.current,
        markered.current,
        productLocations.current
      );
    });
  }

  const searchDetailAddrFromCoords = useCallback((coords: any, callback: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }, []);

  // const displayMarker = useCallback(
  //   (locPosition: any, map: KakaoMap, marker: any) => {
  //     searchDetailAddrFromCoords(locPosition, function (result: any, status: any) {
  //       storeaddress(
  //         result[0]?.address.region_1depth_name +
  //           " " +
  //           result[0]?.address.region_2depth_name +
  //           " " +
  //           result[0]?.address.region_3depth_name
  //       );

  //       let detailAddr = !!result[0]?.road_address
  //         ? "<div>도로명주소 : " + result[0]?.road_address.address_name + "</div>"
  //         : "";
  //       detailAddr += "<div>지번 주소 : " + result[0]?.address.address_name + "</div>";

  //       let content =
  //         '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";

  //       marker.setPosition(locPosition);
  //       marker.setMap(map);

  //       infowindow.setContent(content);
  //       infowindow.open(map, marker);
  //     });

  const getTarget = useCallback(
    (qa: any, map: any, markers: any, marker: any, productLocation: any) => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].marker.setMap(null);
        // 표시된 마커들을 전부 초기화
      }

      markers = []; // 마커들을 담을 배열을 다시 빈배열로 초기화

      const drawingLine = new window.kakao.maps.Polyline(); // 그려지고 있는 원의 반지름을 표시할 선 객체입니다

      const centerPosition = new window.kakao.maps.LatLng(qa.Ma, qa.La); // 지도에 표시될 중심 좌표를 입력받은 qa 위도 경도로 설정 (위도 경도 매개변수 위치가 다른데 어떻게 되는건지 의문)

      marker.setPosition(qa); // 마커 위치를 매개변수로 전닯받은 qa로 옮긴다.

      for (let i = 0; i < productLocation.length; i++) {
        // DB의 도서들을 전부 순회
        const productImg = productLocation[i].images[0].url; // 도서의 이미지에도 접근하기 위해 할당

        const productPosition = new window.kakao.maps.LatLng( // 각각의 도서 위치를 위도와 경도로 지도에 저장
          productLocation[i]["locations"]["lat"],
          productLocation[i]["locations"]["lon"]
        );

        const linePath = [centerPosition, productPosition]; // 그려지고 있는 선을 표시할 좌표 배열 (지도에 표시될 중심 좌표와 도서의 위치를 저장)

        drawingLine.setPath(linePath); // 그려지고 있는 선을 표시할 선 객체에 좌표 배열 설정

        const length = drawingLine.getLength(); // 거리(원의 반지름)를 선 객체를 이용해 구한다.
        const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        const imageSize = new window.kakao.maps.Size(24, 35);
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); // 마커 이미지를 생성합니다

        if (length < 400) {
          // 거리가 표시된 마커와 업로드된 도서의 위치가 400m 이하이면,
          const marker = new window.kakao.maps.Marker({
            map, // 마커를 표시할 지도
            position: productPosition, // 마커를 표시할 위치
            title: productLocation[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커를 표시할 이미지
          });

          const productInfo = productLocation[i]; // 각각의 도서

          const iwContent = ` <img width=150px height = 300px src = "${productImg}"/><div style="padding:5px;" >${productInfo.title}</div><div style="padding:5px;" >${productInfo.locations.address}</div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

          // 인포윈도우를 생성합니다
          const infowindow = new window.kakao.maps.InfoWindow({
            position: productPosition, // 인포윈도우의 위치 = 도서의 위치
            content: iwContent, // 표시될 내용은 위에서 설정한 HTML content
          });

          marker.setMap(map); // 마커가 지도위에 표서되도록 설정
          markers.push({ marker, infowindow, productInfo }); // 마커 배열에 마커와 인포윈도우, 도서 정보 저장
        }

        if (length > 0) {
          drawingLine.setMap(null); // 입력받은 위치와  도서의 위치를 다시 구하기 위해 거리 초기화
        }
      }
      markers.forEach((data: any) => {
        const { marker, infowindow, productInfo } = data;
        window.kakao.maps.event.addListener(marker, "mouseover", function () {
          infowindow.open(map, marker); // 마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
        });

        window.kakao.maps.event.addListener(marker, "click", function () {
          Nav(`/search/${productInfo.id}`); // 마커에 클릭 이벤트가 발생하면 도서 상세 페이지로 이동
        });
        window.kakao.maps.event.addListener(marker, "mouseout", function () {
          infowindow.close(); // 마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
        });
      });
      return markers;
    },
    [Nav]
  );

  const setInfo = useMemo(async () => {
    const { userLocation, productLocation } = await getLocationList(token);

    return { userLocation, productLocation };
  }, [token]);

  const getData = async () => {
    let center;
    if (lat && lon) {
      center = new window.kakao.maps.LatLng(lat, lon);
    } else {
      center = new window.kakao.maps.LatLng(userLocations.current.lat, userLocations.current.lon);
    }

    if (Object.keys(searchResult).length !== 0) {
      let coords: any = searchResult;

      center = new window.kakao.maps.LatLng(coords.y, coords.x);
    }

    const options = {
      center, //지도의 중심좌표.
      level: 4, //지도의 레벨(확대, 축소 정도) -> 레벨이 높을수록 표시되는 단위면적이 커진다.
    };

    const map = new window.kakao.maps.Map(place.current, options);
    searchMap.current = map;
    const marker = new window.kakao.maps.Marker({
      // 지도에 마커를 생성합니다
      position: map.getCenter(), //위치는 지도의 중심 좌표
    });

    markered.current = marker;

    marker.setMap(map); // 지도에 마커를 표시합니다

    let qa = options.center; // 마커가 표시될 위치입니다 (지도의 중심 좌표)

    await setInfo.then((data) => {
      const { userLocation, productLocation } = data;
      productLocations.current = productLocation;
      userLocations.current = userLocation;
    });

    markers.current = getTarget(qa, map, markers.current, marker, productLocations.current);

    window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
      qa = mouseEvent.latLng; // 클릭을 한다면 qa에 클릭한 좌표 할당
      markers.current = getTarget(qa, map, markers.current, marker, productLocations.current);
    });
  };

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      <Container ref={place}>카카오프렌즈</Container>
      <div>KakaoTest</div>
      <div ref={clickLatlng}>이게뭐야</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchPlaces(place.current);
        }}
      >
        <input type="text" ref={keywords} placeholder="검색어를 입력하세요."></input>
      </form>
      <div>KakaoTest</div>
    </>
  );
};
