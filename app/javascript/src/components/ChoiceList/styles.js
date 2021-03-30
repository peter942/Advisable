import styled, { css } from "styled-components";

export const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.optionsPerRow || 1}, auto);
  column-gap: 10px;
  row-gap: 10px;

  ${(props) =>
    props.optionsPerRow &&
    css`
      ${Choice} {
        margin-left: 0;
        justify-self: stretch;
      }
    `}
`;

export const Circle = styled.span`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  position: relative;
  border-radius: 10px;
  display: inline-block;
  border: 2px solid rgba(34, 40, 66, 0.2);

  &:after {
    top: 50%;
    left: 50%;
    content: "";
    width: 10px;
    height: 10px;
    margin-top: -5px;
    margin-left: -5px;
    border-radius: 5px;
    position: absolute;
    background-color: #173fcd;

    opacity: 0;
    transform: scale(0);
    transition: opacity 300ms, transform 300ms;
  }
`;

export const Label = styled.span``;

export const Choice = styled.div`
  margin-left: 10px;

  input {
    opacity: 0;
    position: absolute;
  }

  label {
    width: 100%;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;
    position: relative;
    align-items: center;
    display: inline-flex;
    padding: 0 15px 0 10px;
    background: rgba(29, 39, 75, 0.06);
    cursor: pointer;
  }

  label:hover {
    background: rgba(29, 39, 75, 0.1);
  }

  input:checked + label {
    background: #ecf1fa;

    ${Circle} {
      border-color: #173fcd;

      &:after {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
`;
