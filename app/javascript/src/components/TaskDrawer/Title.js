import React from "react";
import { Title } from "./styles";

export default function TaskDrawerTitle({ value, ...props }) {
  const ref = React.useRef(null);
  const [rows, setRows] = React.useState(1);

  const LINE_HEIGHT = 24;
  const calculateRows = () => {
    const el = ref.current;
    const previousRows = el.rows;
    el.rows = 1;

    let currentRows = Math.floor(el.scrollHeight / LINE_HEIGHT);

    if (currentRows === previousRows) {
      el.rows = currentRows;
    }

    setRows(currentRows);
  };

  React.useLayoutEffect(calculateRows, []);

  React.useLayoutEffect(() => {
    if (props.isFocused) {
      ref.current.focus();
    }
  }, [props.isFocused]);

  React.useEffect(() => {
    if (!value || value === "") {
      setTimeout(() => {
        if (ref.current) {
          ref.current.focus();
        }
      }, 50);
    }
  }, [value]);

  const handleChange = (e) => {
    calculateRows();
    props.onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      ref.current.blur();
    }
  };

  return (
    <Title
      type="text"
      name="name"
      {...props}
      ref={ref}
      rows={rows}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={props.onBlur}
      placeholder="Add a task name..."
    />
  );
}
