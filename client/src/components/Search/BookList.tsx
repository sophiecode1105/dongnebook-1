import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  border: 2px solid green;
`;

const BookImgBox = styled.div`
  width: 100%;
  height: 250px;
`;

const BookImg = styled.img`
  border: 1px solid red;
  width: 100%;
  height: 100%;
`;

const Div = styled.div`
  background-color: pink;
`;
const Content = styled.div`
  background-color: white;
`;

type ListProps = {
  id: number;
  title: string;
  img: string;
  content: string;
  quality: string;
  exchanged: Boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

const Booklist = ({ list }: { list: ListProps }) => {
  const { title, content, img } = list;
  return (
    <Container>
      <BookImgBox>
        <BookImg src={img} />
      </BookImgBox>
      <Div>{title}</Div>
    </Container>
  );
};

export default Booklist;
