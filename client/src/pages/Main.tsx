import AnimationIcon from "../components/Main/AnimationIcon";
import Footer from "../components/Main/Footer";
import ChatService from "../components/Main/ChattingService";
import MainScreen from "../components/Main/MainScreen";
import Explain from "../components/Main/Explain";
import LocationService from "../components/Main/LocationService";
import Start from "../components/Main/Start";

const Main = () => {
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
