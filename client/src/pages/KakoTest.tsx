import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { getLocationList } from "../api";
import { loginState } from "../state/state";
declare global {
  interface Window {
    kakao: any;
  }
}

export const KakaoTest = () => {
  const Container = styled.div`
    width: 320px;
    height: 320px;
  `;

  let place = useRef(null);

  const clickLatlng = useRef<HTMLInputElement>(null);
  const keywords = useRef<HTMLInputElement>(null);
  const markers = useRef([]);
  const markered = useRef(null);
  const productLocations = useRef(null);
  const Nav = useNavigate();
  const token = useRecoilValue(loginState);
  useEffect(() => {
    getData();
  }, []);

  function searchPlaces(map: any) {
    const keyword = keywords.current?.value;
    var ps = new window.kakao.maps.services.Places();
    if (!keyword?.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, (data: any, status: any, pagination: any) => {
      const bounds = new window.kakao.maps.LatLngBounds();

      for (let i = 0; i < data.length; i++) {
        let placePosition = new window.kakao.maps.LatLng(data[i].y, data[i].x);
        bounds.extend(placePosition);
      }

      map.setBounds(bounds);

      markers.current = getTarget(map.getCenter(), map, markers.current, markered.current, productLocations.current);
    });
  }

  const getData = async () => {
    const { userLocation, productLocation } = await getLocationList(token);
    productLocations.current = productLocation;

    const options = {
      center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lon), //지도의 중심좌표.
      level: 4, //지도의 레벨(확대, 축소 정도)
    };

    if (place.current) {
      let map = new window.kakao.maps.Map(place.current, options);
      place.current = map;
      const marker = new window.kakao.maps.Marker({
        // 지도 중심좌표에 마커를 생성합니다
        position: map.getCenter(),
      });

      markered.current = marker;

      // 지도에 마커를 표시합니다
      marker.setMap(map);
      // 마커가 표시될 위치입니다

      // 지도에 클릭 이벤트를 등록합니다

      let qa = options.center;

      markers.current = getTarget(qa, map, markers.current, marker, productLocation);
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
        qa = mouseEvent.latLng;

        markers.current = getTarget(qa, map, markers.current, marker, productLocation);
      });
    }
  };

  function getTarget(qa: any, map: any, markers: any, marker: any, productLocation: any) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].marker.setMap(null);
    }

    markers = [];

    // 원이 그려질 중심좌표를 클릭한 위치로 설정합니다
    var drawingLine = new window.kakao.maps.Polyline(); // 그려지고 있는 원의 반지름을 표시할 선 객체입니다

    //
    let centerPosition = new window.kakao.maps.LatLng(qa.Ma, qa.La);

    // 마커 위치를 클릭한 위치로 옮깁니다
    marker.setPosition(qa);
    // 그려지고 있는 원의 반경 정보를 표시할 커스텀오버레이를 생성합니다

    // // 마커를 생성하고 지도위에 표시하는 함수입니다

    for (let i = 0; i < productLocation.length; i++) {
      const productImg = productLocation[i].images[0].url;

      let productPosition = new window.kakao.maps.LatLng(
        productLocation[i]["locations"]["lat"],
        productLocation[i]["locations"]["lon"]
      );
      // 그려지고 있는 선을 표시할 좌표 배열입니다. 클릭한 중심좌표와 마우스커서의 위치로 설정합니다
      var linePath = [centerPosition, productPosition];
      // 그려지고 있는 선을 표시할 선 객체에 좌표 배열을 설정합니다
      drawingLine.setPath(linePath);
      // 원의 반지름을 선 객체를 이용해서 얻어옵니다
      var length = drawingLine.getLength();
      var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
      const imageSize = new window.kakao.maps.Size(24, 35);
      //   마커 이미지를 생성합니다
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

      if (length < 400) {
        let marker = new window.kakao.maps.Marker({
          map, // 마커를 표시할 지도
          position: productPosition, // 마커를 표시할 위치
          title: productLocation[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage,
        });
        const productInfo = productLocation[i];

        var iwContent = ` <img width=150px height = 300px src = "${productImg}"/><div style="padding:5px;" >${productInfo.title}</div><div style="padding:5px;" >${productInfo.locations.address}</div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다

        //   iwPosition = new window.kakao.maps.LatLng(37.496590501605496, 127.02469765019322); //인포윈도우 표시 위치입니다

        // 인포윈도우를 생성합니다
        var infowindow = new window.kakao.maps.InfoWindow({
          position: productPosition,
          content: iwContent,
        });

        //   마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다

        marker.setMap(map);
        markers.push({ marker, infowindow, productInfo });
      }

      if (length > 0) {
        drawingLine.setMap(null);
      }
    }
    // 마커에 마우스오버 이벤트를 등록합니다

    markers.forEach((data: any) => {
      const { marker, infowindow, productInfo } = data;
      window.kakao.maps.event.addListener(marker, "mouseover", function () {
        //   마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
        infowindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, "click", function () {
        //   마커에 마우스오버 이벤트가 발생하면 인포윈도우를 마커위에 표시합니다
        console.log("product");
        console.log(productInfo);

        Nav(`/search/${productInfo.id}`);
      });

      //   마커에 마우스아웃 이벤트를 등록합니다
      window.kakao.maps.event.addListener(marker, "mouseout", function () {
        //   마커에 마우스아웃 이벤트가 발생하면 인포윈도우를 제거합니다
        infowindow.close();
      });
    });

    // console.log("@@@@@@2");
    // console.log(markers);

    return markers;
  }
  return (
    <>
      <div>KakaoTest</div>
      <div>KakaoTest</div>
      <div>KakaoTest</div>
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
