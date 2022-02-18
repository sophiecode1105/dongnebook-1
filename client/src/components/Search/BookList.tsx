import styled from "styled-components";
import { Link } from "react-router-dom";
import { ListProps } from "../../state/typeDefs";

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 90%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0px 0px 20px 0px;
  margin-bottom: 10px;
`;

const BookImgBox = styled.div`
  width: 100%;
  height: 80%;
`;

const BookImg = styled.img`
  width: 100%;
  height: 100%;
  margin: auto;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 19px;
  height: 10%;
  margin: 5px 5px 0px 5px;
`;
const Location = styled.div`
  height: 10%;
  font-size: 15px;
  margin: 5px;
  color: rgba(0, 0, 0, 0.6);
`;

const Booklist = ({ list }: { list: ListProps }) => {
  const { id, title, content, locations, images } = list;
  // console.log(images);
  // const { address } = locations;
  return (
    <Container to={`${id}`}>
      <BookImgBox>
        <BookImg src={images && images[0].url} />
      </BookImgBox>
      <Title>{title}</Title>
      <Location>{locations?.address}</Location>
    </Container>
  );
};

export default Booklist;
