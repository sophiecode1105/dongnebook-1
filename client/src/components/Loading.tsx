import loadingImg from "../img/loading.gif";

const Loading = () => (
  <div className="pt-14 h-[50vh] flex justify-center items-center flex-col">
    <img src={loadingImg} alt="loading" className="mb-4" />
    <h1 className="text-3xl font-bold">Loading...</h1>
  </div>
);

export default Loading;
