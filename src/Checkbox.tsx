import React from "react";
import { useToggleState } from "@react-stately/toggle";
import { useCheckbox } from "@react-aria/checkbox";
import { ToggleProps } from "@react-types/checkbox";

export function Checkbox(props: ToggleProps) {
  let { children } = props;
  let state = useToggleState(props);
  let ref = React.useRef();
  let { inputProps } = useCheckbox(props, state, ref);

  return (
    <label className="">
      <input {...inputProps} ref={ref} />
      {children}
    </label>
  );
}
