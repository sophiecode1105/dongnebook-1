import styled from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import iconblack from "../../img/iconblack.png";
import loading from "../../img/loading.gif";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import {
  searchLocation,
  mapResultsStorage,
  currentLocationStorage,
  currentLatitude,
  currentLongtitude,
  currentaddress,
  modifyLatitude,
  modifyLongtitude,
} from "../../state/state";
import { KakaoMap } from "../../state/typeDefs";

declare global {
  interface Window {
    kakao: any;
  }
}

const ExchangeLocation = styled.div`
  margin-top: 10px;
  width: 95%;
  height: 400px;
`;

const Conatiner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 400px;
  color: grey;
`;
const Loading = styled.img`
  margin-top: 10px;
`;

const Map = ({ modifyLatitu, modifyLongtitu }: { modifyLatitu: any; modifyLongtitu: any }) => {
  const place = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [marker, setMarker] = useState<any>(null);
  const [infowindow, setInfoWindow] = useState<any>(
    useCallback(() => new window.kakao.maps.InfoWindow({ zindex: 1 }), [])
  );
  const [geocoder, setGeocoder] = useState<any>(useCallback(() => new window.kakao.maps.services.Geocoder(), []));
  const [currentLocation, setCurrentLocation] = useRecoilState(currentLocationStorage);
  const latitude = useSetRecoilState(currentLatitude);
  const longtitude = useSetRecoilState(currentLongtitude);
  const storeaddress = useSetRecoilState(currentaddress);
  const searchContent = useRecoilValue(searchLocation);
  const setMapSearchResults = useSetRecoilState(mapResultsStorage);
  const modifyLat = useRecoilValue(modifyLatitude);
  const modifyLon = useRecoilValue(modifyLongtitude);
  const imageSrc = iconblack;
  const imageSize = useMemo(() => new window.kakao.maps.Size(64, 69), []);
  const imageOption = useMemo(() => {
    return { offset: new window.kakao.maps.Point(35, 69) };
  }, []);
  const makerImage = useMemo(
    () => new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    [imageOption, imageSize, imageSrc]
  );

  const searchDetailAddrFromCoords = useCallback(
    (coords: any, callback: any) => {
      geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
    },
    [geocoder]
  );

  const displayMarker = useCallback(
    (locPosition: any, map: KakaoMap, marker: any) => {
      searchDetailAddrFromCoords(locPosition, function (result: any, status: any) {
        storeaddress(
          result[0]?.address.region_1depth_name +
            " " +
            result[0]?.address.region_2depth_name +
            " " +
            result[0]?.address.region_3depth_name
        );

        let detailAddr = !!result[0]?.road_address
          ? "<div>도로명주소 : " + result[0]?.road_address.address_name + "</div>"
          : "";
        detailAddr += "<div>지번 주소 : " + result[0]?.address.address_name + "</div>";

        let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";

        marker.setPosition(locPosition);
        marker.setMap(map);

        infowindow.setContent(content);
        infowindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
        // 클릭한 위도, 경도 정보를 가져옵니다
        searchDetailAddrFromCoords(mouseEvent.latLng, function (result: any, status: any) {
          storeaddress(
            result[0]?.address.region_1depth_name +
              " " +
              result[0]?.address.region_2depth_name +
              " " +
              result[0]?.address.region_3depth_name
          );
          let detailAddr = !!result[0].road_address
            ? "<div>도로명주소 : " + result[0]?.road_address.address_name + "</div>"
            : "";
          detailAddr += "<div>지번 주소 : " + result[0]?.address.address_name + "</div>";

          let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";

          map?.setCenter(mouseEvent.latLng);
          marker.setPosition(mouseEvent.latLng);
          marker.setMap(map);

          latitude(mouseEvent.latLng?.getLat());
          longtitude(mouseEvent.latLng?.getLng());

          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      });
    },
    [infowindow, latitude, longtitude, searchDetailAddrFromCoords, storeaddress]
  );

  useEffect(() => {
    const container = place.current;

    navigator.geolocation.getCurrentPosition((position) => {
      console.log("처음찍히는거", modifyLatitu);
      console.log("처음찍히는거", modifyLongtitu);
      let lat = localStorage.getItem("whichmap") === "등록" ? position.coords.latitude : modifyLatitu;
      let lon = localStorage.getItem("whichmap") === "등록" ? position.coords.longitude : modifyLongtitu;
      console.log("첫렌더링ㅇ이안되는이유?", modifyLatitu);
      console.log("두번째렌더링ㅇ이안되는이유?", modifyLongtitu);

      let locPosition = new window.kakao.maps.LatLng(lat, lon);
      let kakaoMap = new window.kakao.maps.Map(container, {
        center: locPosition,
      });

      window.kakao.maps.event.addListener(kakaoMap, "tilesloaded", () => {
        setMapLoaded(true);
      });

      // kakaoMap.setCenter(locPosition);
      let newMarker = new window.kakao.maps.Marker({
        map: map,
        position: locPosition,
        image: makerImage,
      });
      displayMarker(locPosition, kakaoMap, newMarker);
      setMarker(newMarker);
      setMap(kakaoMap);
      latitude(lat);
      longtitude(lon);
    });

    return () => {
      setMap(null);
      setMarker(null);
    };
  }, [displayMarker, latitude, longtitude, makerImage, map, modifyLat, modifyLon]);

  useEffect(() => {
    latitude(modifyLat);
    longtitude(modifyLon);
    setCurrentLocation({ x: modifyLon, y: modifyLat });
  }, [latitude, longtitude, setCurrentLocation, modifyLat, modifyLon]);

  useEffect(() => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(searchContent, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setMapSearchResults(result);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 없습니다.");
      } else {
      }
    });
  }, [setMapSearchResults, searchContent]);

  useEffect(() => {
    let coords: any = currentLocation;
    const moveLatLng = new window.kakao.maps.LatLng(coords.y, coords.x);
    searchDetailAddrFromCoords(moveLatLng, function (result: any, status: any) {
      // console.log("여기로 변경", coords);
      latitude(coords.y);
      longtitude(coords.x);
      if (result[0]) {
        storeaddress(
          result[0].address?.region_1depth_name +
            " " +
            result[0].address?.region_2depth_name +
            " " +
            result[0].address?.region_3depth_name
        );

        let detailAddr = !!result[0]?.road_address
          ? "<div>도로명주소 : " + result[0]?.road_address?.address_name + "</div>"
          : "";
        detailAddr += "<div>지번 주소 : " + result[0]?.address?.address_name + "</div>";

        let content = '<div class="bAddr" style="width:250px; padding:5px">' + detailAddr + "</div>";
        marker?.setPosition(moveLatLng);
        marker?.setMap(map);
        map?.panTo(moveLatLng);

        infowindow.setContent(content);
        infowindow.open(map, marker);
      }
    });
  }, [infowindow, latitude, longtitude, marker, searchDetailAddrFromCoords, storeaddress, currentLocation, map]);

  return (
    <ExchangeLocation ref={place}>
      {mapLoaded ? null : (
        <Conatiner>
          now loading...
          <Loading src={loading} />
        </Conatiner>
      )}
    </ExchangeLocation>
  );
};

export default Map;
