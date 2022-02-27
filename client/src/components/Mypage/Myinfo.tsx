import styled from "styled-components";
import MemberInfo from "./MemberInfo";
import MyList from "./MyList";
import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { ableExchange, loginState, pressLike, unableExchange, userState } from "../../state/state";
import { getMemberInfo } from "../../api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  padding: 66px 0px 20px 0px;
  max-width: 1200px;
  height: 100vh;
`;

const MypageBox = styled.div`
  width: 85%;
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 10px;
`;

const MypageTitle = styled.div`
  color: black;
  font-weight: bold;
  font-size: 23px;
  padding-left: 5px;
`;

const Myinfo = () => {
  const [user, setUser] = useRecoilState(userState);
  const [exchangeableList, setExchangeableList] = useRecoilState(ableExchange);
  const [unExchangeableList, setUnexchangeableList] = useRecoilState(unableExchange);
  const [likesList, setLikesList] = useRecoilState(pressLike);
  const token = useRecoilValue(loginState);

  const getUserInfo = useCallback(async () => {
    const { userInfo, exchangeFalse, exchangeTrue } = await getMemberInfo(token || "token");
    setUser(userInfo);
    setExchangeableList(exchangeFalse);
    setUnexchangeableList(exchangeTrue);
    let newArrLikes = [];
    for (let i = 0; i < userInfo?.likes?.length; i++) {
      newArrLikes.push(userInfo?.likes[i]["products"]);
    }
    setLikesList(newArrLikes);
  }, [setExchangeableList, setLikesList, setUnexchangeableList, setUser, token]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <Container>
      <MypageBox>
        <MypageTitle>마이페이지</MypageTitle>
      </MypageBox>
      <MemberInfo user={user} />
      <MyList exchangeableList={exchangeableList} unExchangeableList={unExchangeableList} likesList={likesList} />
    </Container>
  );
};
export default Myinfo;
