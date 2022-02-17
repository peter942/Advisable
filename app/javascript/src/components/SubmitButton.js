import React from "react";
import { Button } from "@advisable/donut";
import { useFormikContext } from "formik";

// The SubmitButton component is a simple wrapper around the Donut Button component
// that hooks into the formik state and adds the loading indicator based on the formik
// isSubmitting state.
function SubmitButton({ disableUntilValid, disabled, ...props }) {
  const formik = useFormikContext();

  const handleClick = (e) => {
    formik.submitForm();
    e.preventDefault();
    return;
  };

  return (
    <Button
      type="submit"
      onClick={handleClick}
      loading={formik.isSubmitting}
      disabled={disabled || (disableUntilValid ? !formik.isValid : null)}
      {...props}
    />
  );
}

export default SubmitButton;
