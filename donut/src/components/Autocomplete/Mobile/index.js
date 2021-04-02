import React from "react";
import Menu from "./Menu";
import Input from "../../Input";
import { Autocomplete as AutocompleteStyles, Tags } from "../styles";
import Tag from "../Tag";
import { getSelected, getSelectedMultiple, handleRemoveItem } from "../utils";

const AutocompleteMobile = (props) => {
  const {
    options,
    placeholder,
    onChange,
    size,
    initalSelectedItem,
    primary,
    onPrimaryChange,
    formatLabel,
    ...rest
  } = props;

  const [open, setOpen] = React.useState(false);

  const handleChange = (value) => {
    if (!props.multiple) {
      setOpen(false);
    }
    if (onChange) onChange(value);
  };

  const selected = props.multiple
    ? getSelectedMultiple(props.value, options)
    : getSelected(props.value, options);

  const handleFocus = (e) => {
    setOpen(true);
  };

  return (
    <AutocompleteStyles {...rest}>
      <Input
        size={size}
        value={initalSelectedItem?.label || ""}
        onFocus={handleFocus}
        placeholder={placeholder}
        readOnly
      />
      {props.multiple && (
        <Tags>
          {selected.map((item) => (
            <Tag
              key={item.value}
              isPrimary={primary === item.value}
              onSelectPrimary={
                onPrimaryChange && (() => onPrimaryChange(item.value))
              }
              onRemove={handleRemoveItem(item, props.value, onChange)}
            >
              {formatLabel(item)}
            </Tag>
          ))}
        </Tags>
      )}
      {open && (
        <Menu
          max={props.max}
          isMax={props.isMax}
          value={props.value}
          multiple={props.multiple}
          onClose={() => setOpen(false)}
          onChange={handleChange}
          placeholder={placeholder}
          options={options}
          initalSelectedItem
          formatLabel={formatLabel}
        />
      )}
    </AutocompleteStyles>
  );
};

export default AutocompleteMobile;
