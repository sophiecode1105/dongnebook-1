import React, { useEffect, useRef, useState } from "react";

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
    width: 500px;
    height: 500px;
  `;

  let place = useRef(null);
  const clickLatlng = useRef<HTMLInputElement>(null);
  const token = useRecoilValue(loginState);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { userLocation, productLocation } = await getLocationList(token);

    const options = {
      center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lon), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    if (place.current) {
      const map = new window.kakao.maps.Map(place.current, options);

      // 마커가 표시될 위치입니다

      //   var iwContent = '<div style="padding:5px;">Hello World! </div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      //     iwPosition = new window.kakao.maps.LatLng(37.496590501605496, 127.02469765019322); //인포윈도우 표시 위치입니다

      //   // 인포윈도우를 생성합니다
      //   var infowindow = new window.kakao.maps.InfoWindow({
      //     position: iwPosition,
      //     content: iwContent,
      //   });

      // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
      //   infowindow.open(map, marker);

      window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
        // 클릭한 위도, 경도 정보를 가져옵니다
        const latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        // marker.setPosition(latlng);

        let message = "클릭한 위치의 위도는 " + latlng.getLat() + " 이고, ";
        message += "경도는 " + latlng.getLng() + " 입니다";

        const currentLatlng = clickLatlng.current;
        if (currentLatlng) {
          currentLatlng.innerHTML = message;
        }
      });

      // 지도에 클릭 이벤트를 등록합니다
      window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
        // 클릭 이벤트가 발생했을 때 원을 그리고 있는 상태가 아니면 중심좌표를 클릭한 지점으로 설정합니다

        // 원이 그려질 중심좌표를 클릭한 위치로 설정합니다
        var drawingLine = new window.kakao.maps.Polyline(); // 그려지고 있는 원의 반지름을 표시할 선 객체입니다
        var drawingOverlay: any; // 그려지고 있는 원의 반경을 표시할 커스텀오버레이 입니다

        let qa = mouseEvent.latLng;

        let centerPosition = new window.kakao.maps.LatLng(qa.Ma, qa.La);

        // 그려지고 있는 원의 반경 정보를 표시할 커스텀오버레이를 생성합니다
        if (!drawingOverlay) {
          drawingOverlay = new window.kakao.maps.CustomOverlay({
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 1,
          });
        }

        for (let i = 0; i < productLocation.length; i++) {
          let mousePosition = new window.kakao.maps.LatLng(
            productLocation[i]["locations"]["lat"],
            productLocation[i]["locations"]["lon"]
          );

          // 그려지고 있는 선을 표시할 좌표 배열입니다. 클릭한 중심좌표와 마우스커서의 위치로 설정합니다

          var linePath = [centerPosition, mousePosition];

          // 그려지고 있는 선을 표시할 선 객체에 좌표 배열을 설정합니다

          drawingLine.setPath(linePath);

          // 원의 반지름을 선 객체를 이용해서 얻어옵니다
          var length = drawingLine.getLength();

          if (length < 1000) {
            var imageSrc =
              "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

            const imageSize = new window.kakao.maps.Size(24, 35);

            // 마커 이미지를 생성합니다
            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

            var marker = new window.kakao.maps.Marker({
              map, // 마커를 표시할 지도
              position: mousePosition, // 마커를 표시할 위치
              title: productLocation[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
              //   image: markerImage,
            });
          }

          // 그려지고 있는 원의 옵션을 설정합니다

          // 반경 정보를 표시할 커스텀오버레이의 내용입니다

          if (length > 0) {
            // 반경 정보를 표시할 커스텀오버레이의 내용입니다

            const content =
              '<div class="info">반경 <span class="number">' + parseInt(length) + "</span>m</div>";

            // 반경 정보를 표시할 커스텀 오버레이의 좌표를 마우스커서 위치로 설정합니다
            drawingOverlay.setPosition(mousePosition);

            // 반경 정보를 표시할 커스텀 오버레이의 표시할 내용을 설정합니다
            drawingOverlay.setContent(content);

            // 그려지고 있는 원의 반경정보 커스텀 오버레이를 지도에 표시합니다
            drawingOverlay.setMap(map);

            drawingLine.setMap(null);
            drawingOverlay.setMap(null);
          }
          // 마우스 커서의 현재 위치를 얻어옵니다
        }
        var marker = new window.kakao.maps.Marker(null);
      });
    }
  };

  // 1. 내위치를 저장해야돼
  // 2. DB에 있는 프로덕트으 위치를 가지고 와
  // 3. 2번의 배열을 조회하면서 내위치와의 거리를 구해서
  // 3-1  배열에서 반복문으로,
  // 4. 기준에 충족하는 프로덕트만 배열에 담아
  // 5. 4번에서 충족한 프로덕트를 마커로 표시

  return (
    <>
      <div>KakaoTest</div>
      <div>KakaoTest</div>
      <div>KakaoTest</div>
      <Container ref={place}>카카오프렌즈</Container>
      <div>KakaoTest</div>

      <div ref={clickLatlng}>이게뭐야</div>

      <div>KakaoTest</div>
    </>
  );
};
