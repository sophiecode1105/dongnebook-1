import styled from "styled-components";
import { Link } from "react-router-dom";
import { ListProps } from "../../state/typeDefs";

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.2);
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
`;
const Location = styled.div`
  font-size: 15px;
  color: rgba(0, 0, 0, 0.6);
`;

const Booklist = ({ list }: { list: ListProps }) => {
  const { id, title, locations, images } = list;

  return (
    <Container to={`${id}`}>
      <BookImgBox>
        <BookImg src={images[0]?.url} />
      </BookImgBox>
      <div className="px-1">
        <Title>{title.length < 13 ? title : `${title.slice(0, 13)}..`}</Title>
        <Location>{locations?.address}</Location>
      </div>
    </Container>
  );
};

export default Booklist;
