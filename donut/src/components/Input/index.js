import React, { useRef, useState } from "react";
import {
  StyledInput,
  StyledInputControl,
  StyledInputDecoration,
} from "./styles";

// A basic input component. Other form control components build upon this
// component.
const Input = React.forwardRef(function Input(
  {
    size,
    prefix,
    suffix,
    error,
    margin,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    marginX,
    marginY,
    ...props
  },
  ref,
) {
  const containerRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
    props.onFocus(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    props.onBlur(e);
  };

  function handleDecorationClick() {
    containerRef.current.querySelector("input").focus();
  }

  return (
    <StyledInput
      ref={containerRef}
      data-focused={focused}
      $error={error}
      $disabled={props.disabled}
      size={size}
      margin={margin}
      marginX={marginX}
      marginY={marginY}
      marginTop={marginTop}
      marginRight={marginRight}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
    >
      {prefix ? (
        <StyledInputDecoration onClick={handleDecorationClick}>
          {prefix}
        </StyledInputDecoration>
      ) : null}
      <StyledInputControl
        {...props}
        ref={ref}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {suffix ? (
        <StyledInputDecoration onClick={handleDecorationClick}>
          {suffix}
        </StyledInputDecoration>
      ) : null}
    </StyledInput>
  );
});

Input.defaultProps = {
  onBlur: () => {},
  onFocus: () => {},
  size: "md",
};

export default Input;
