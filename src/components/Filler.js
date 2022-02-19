import styled, { css } from "styled-components";

export const Filler = styled.div`
  position: absolute;
  width: 100%;
  background-color: rgb(121, 134, 203);
  top: ${(props) => props.top}px;
  height: ${(props) => props.height}px;
  z-index: 10;
  border: 1px solid transparent;
  border-radius:10px;
  box-shadow:3px 4px 10px 3px;
  color:lightgray;
  ${(props) =>
    props.width &&
    css`
      width: 14%;
    `}

  left:${(props) => props.left}%;
`;
