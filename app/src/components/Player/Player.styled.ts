import styled from "styled-components";

type ContainerProps = {
  active: boolean;
};

export const Container = styled.div<ContainerProps>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  z-index: 10;
  transition: transform 1s ease;
  transform: ${(props) =>
    props.active ? "translateY(0)" : "translateY(100%)"};
`;
