import styled from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import iconblack from "../../img/iconblack.png";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { searchLocation, mapResultsStorage, currentaddress, currentLocationStorage } from "../../state/state";
import { KakaoMap } from "../../state/typeDefs";

declare global {
  interface Window {
    kakao: any;
  }
}

const ExchangeLocation = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 400px;
`;

const Map = ({ mapLat, mapLong }: { mapLat: any; mapLong: any }) => {
  const place = useRef(null);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [marker, setMarker] = useState<any>(null);
  const [infowindow] = useState<any>(useCallback(() => new window.kakao.maps.InfoWindow({ zindex: 1 }), []));
  const [geocoder] = useState<any>(useCallback(() => new window.kakao.maps.services.Geocoder(), []));
  const storeaddress = useSetRecoilState(currentaddress);
  const setCurrentLocation = useSetRecoilState(currentLocationStorage);
  const searchContent = useRecoilValue(searchLocation);
  const setMapSearchResults = useSetRecoilState(mapResultsStorage);
  const imageSrc = iconblack;
  const imageSize = useMemo(() => new window.kakao.maps.Size(64, 69), []);
  const imageOption = useMemo(() => {
    return { offset: new window.kakao.maps.Point(35, 69) };
  }, []);
  const makerImage = useMemo(
    () => new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    [imageOption, imageSize, imageSrc]
  );

  const displayMarker = useCallback(
    (map: KakaoMap, marker: any, locPosition: any) => {
      geocoder.coord2Address(locPosition.getLng(), locPosition.getLat(), (result: any, status: any) => {
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
    },
    [geocoder, infowindow, storeaddress]
  );

  const addClickListener = useCallback(
    (map: KakaoMap, marker: any) => {
      window.kakao.maps.event.removeListener(map, "click");
      window.kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
        // 클릭한 위도, 경도 정보를 가져옵니다
        let mouseLat = mouseEvent.latLng.getLat();
        let mouseLon = mouseEvent.latLng.getLng();

        geocoder.coord2Address(mouseLon, mouseLat, (result: any, status: any) => {
          if (!result) return;
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

          map?.setCenter(mouseEvent.latLng);
          marker.setPosition(mouseEvent.latLng);
          marker.setMap(map);

          setCurrentLocation({
            y: mouseEvent.latLng?.getLat(),
            x: mouseEvent.latLng?.getLng(),
          });

          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      });
    },
    [geocoder, infowindow, setCurrentLocation, storeaddress]
  );

  useEffect(() => {
    let locPosition = new window.kakao.maps.LatLng(mapLat, mapLong);
    if (map) {
      displayMarker(map, marker, locPosition);
      map.panTo(locPosition);
    }
  }, [mapLat, mapLong, displayMarker, map, marker]);

  useEffect(() => {
    const container = place.current;
    let lat = mapLat;
    let lon = mapLong;
    let locPosition = new window.kakao.maps.LatLng(lat, lon);
    let kakaoMap;
    if (map === null) {
      kakaoMap = new window.kakao.maps.Map(container, {
        center: locPosition,
      });
    } else {
      kakaoMap = map;
    }

    let newMarker = new window.kakao.maps.Marker({
      map: kakaoMap,
      position: locPosition,
      image: makerImage,
    });

    displayMarker(kakaoMap, newMarker, locPosition);
    addClickListener(kakaoMap, newMarker);
    setMarker(newMarker);
    setMap(kakaoMap);

    return () => {
      setMap(null);
      setMarker(null);
    };
  }, [addClickListener, displayMarker, makerImage, map, mapLat, mapLong]);

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

  return <ExchangeLocation ref={place} />;
};

export default Map;
