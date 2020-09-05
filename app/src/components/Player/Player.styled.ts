import styled, { keyframes } from "styled-components";
import { Radar } from "@styled-icons/zondicons";

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

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const RotatingRadar = styled(Radar)`
  animation: ${rotate} 2s linear infinite;
`;
