import { rgba } from "polished";
import styled, { css, keyframes } from "styled-components";
import colors from "../../colors";
import { Status } from "../Status/styles";
import { Menu } from "../Menu/styles";
import { Icon } from "../Icon/styles";

const placeholderColor = color => css`
  &::-webkit-input-placeholder {
    color: ${color};
  }
  &::-moz-placeholder {
    color: ${color};
  }
  &:-ms-input-placeholder {
    color: ${color};
  }
  &:-moz-placeholder {
    color: ${color};
  }
`;

export const TaskDrawer = styled.div`
  height: 100%;
  position: relative;

  ${Status} {
    margin-top: 8px;
    margin-left: 8px;
    margin-bottom: 2px;
  }

  ${Menu} {
    top: 20px;
    right: 50px;
    position: absolute;
  }
`;

export const Title = styled.textarea`
  width: 100%;
  padding: 8px;
  border: none;
  resize: none;
  height: auto;
  outline: none;
  overflow: auto;
  color: #0a163f;
  font-size: 21px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: border-color 200ms;

  &:not([readonly]) {
    &:hover {
      background: #f5f6f9;
    }

    &:focus {
      background: #f5f6f9;
      border: 2px solid ${colors.blue.base};
    }
  }

  ${placeholderColor(colors.neutral.s5)}
`;

export const TaskDetails = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  margin: 0 8px 30px 8px;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
`;

export const Detail = styled.button`
  padding: 8px;
  border: none;
  text-align: left;
  appearance: none;
  margin-left: -8px;
  padding-left: 55px;
  position: relative;
  margin-right: 60px;
  border-radius: 6px;
  line-height: 18px;
  background: transparent;

  @media (max-width: 900px) {
    margin-right: 15px;
  }

  &:focus {
    outline: none;
  }

  ${props =>
    !props.readOnly &&
    css`
      &:hover {
        cursor: pointer;
        background: #f5f6f9;
      }
    `}
`;

export const Popout = styled.div`
  z-index: 1;
  width: 300px;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 60px ${rgba(colors.neutral.s9, 0.25)},
    0 2px 8px ${rgba(colors.neutral.s9, 0.1)};
`;

const promptAnimation = keyframes`
  from {
    opacity: 0.5;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(1.3);
  }
`;

export const DetailIcon = styled.div`
  top: 50%;
  left: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  user-select: none;
  position: absolute;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: ${colors.blue.base};
  background: ${rgba(colors.blue.base, 0.075)};
  transform: translateY(-50%);

  ${Icon} {
    display: flex;
  }

  ${props =>
    props.prompt &&
    css`
      &::before {
        content: "";
        width: 100%;
        height: 100%;
        border-radius: 50%;
        position: absolute;
        border: 1px solid ${colors.blue.base};
        animation: ${promptAnimation} 2s infinite;
      }
    `}
`;

export const DetailLabel = styled.h5`
  color: #7f87a5;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.005em;
  text-transform: uppercase;
`;

export const DetailValue = styled.span`
  color: ${colors.neutral.s9};
  font-size: 15px;
  font-weight: 500;
  
  @media (max-width: 900px) {
    font-size: 13px;
  }
`;

export const DetailPlaceholder = styled(DetailValue)`
  color: ${colors.neutral.s4};
`;

export const Label = styled.label`
  color: #0a163f;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin: 0 8px 4px 8px;
`;

export const Description = styled.textarea`
  width: 100%;
  padding: 8px;
  border: none;
  resize: none;
  height: auto;
  outline: none;
  overflow: auto;
  color: #0a163f;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 2px solid transparent;
  transition: border-color 200ms;
  ${placeholderColor(colors.neutral.s5)}

  &:not([readonly]) {
    &:hover {
      background: #f5f6f9;
    }

    &:focus {
      background: #f5f6f9;
      border: 2px solid ${colors.blue.base};
    }
  }
`;

export const Confirmation = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  background: ${rgba("#FFFFFF", 0.75)};
`;

export const ConfirmationContainer = styled.div`
  padding: 30px;
  max-width: 400px;
  background: white;
  border-radius: 8px;
  position: absolute;
  text-align: center;
  box-shadow: 0 8px 60px ${rgba(colors.neutral.s8, 0.2)},
    0 2px 6px ${rgba(colors.neutral.s8, 0.15)};
`;

export const ArrowPrompt = styled.div`
  left: 14px;
  bottom: -30px;
  position: absolute;
  color: ${colors.blue.base};
`;

export const StageDescription = styled.div`
  z-index: 0;
  font-size: 14px;
  line-height: 18px;
  border-radius: 6px;
  position: relative;
  padding: 12px 8px 12px 48px;
  color: ${colors.neutral.s8};
  background: ${colors.neutral.s1};

  ${Icon} {
    top: 50%;
    left: 16px;
    position: absolute;
    transform: translateY(-50%);
    color: ${colors.blue.base};
  }
`;

export const SavingIndicator = styled.div`
  padding: 0;
  opacity: 0;
  width: 100%;
  color: ${colors.neutral.s7};
  display: flex;
  font-size: 12px;
  font-weight: 500;
  align-items: center;
  justify-content: center;
  background-color: ${colors.neutral.s1};
  transition: opacity 200ms, height 300ms;
  height: 0px;

  ${props => props.isSaving && css`
    opacity: 1;
    height: 24px;
    transition: opacity 200ms, height 300ms;
  `}
`