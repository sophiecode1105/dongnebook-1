import AnimationIcon from "../components/Main/AnimationIcon";
import Footer from "../components/Main/Footer";
import ChatService from "../components/Main/ChattingService";
import MainScreen from "../components/Main/MainScreen";
import Explain from "../components/Main/Explain";
import LocationService from "../components/Main/LocationService";
import Start from "../components/Main/Start";
import { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    // Scroll Animation (sa, 스크롤 애니메이션)
    const saTriggerMargin = 300; // 언제쯤 이 요소를 보이게 할 것인지 정하는 장치
    const saElementList = document.querySelectorAll(".sa");
    const dnElementList = document.querySelectorAll("._paused");

    const saFunc = function () {
      saElementList.forEach((element: Element) => {
        if (!element.classList.contains("show")) {
          if (window.innerHeight > element.getBoundingClientRect().top + saTriggerMargin) {
            // 내 화면의 내부높이 > 특정요소의 윗부분 + 특정요소에서 얼마만큼 더 내려가야 보이게 할 것인지 정하는 장치
            element.classList.add("show"); // 조건이 성립하면 show라는 클래스를 추가함
          }
        }
      });
      dnElementList.forEach((element: any) => {
        // console.log("wh", window.innerHeight);
        // console.log("et", element.getBoundingClientRect().top);
        if (window.innerHeight > element.getBoundingClientRect().top + 400) {
          // alert("trigger");
          // console.log("trigger");
          // setTimeout(() => {
          //   element.classList.remove("_paused");
          //   console.log(element);
          //   element.classList.add("_running");
          //   console.log(element);
          // }, 300);
          // 내 화면의 내부높이 > 특정요소의 윗부분 + 특정요소에서 얼마만큼 더 내려가야 보이게 할 것인지 정하는 장치
        }
      });
    };

    window.addEventListener("scroll", saFunc);
    return () => window.removeEventListener("scroll", saFunc);
  }, []);

  return (
    <>
      <MainScreen />
      <Explain />
      <AnimationIcon />
      <LocationService />
      <ChatService />
      <Start />
      <Footer />
    </>
  );
};

export default Main;
