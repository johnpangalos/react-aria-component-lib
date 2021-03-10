import React from "react";
import { useToggleState } from "@react-stately/toggle";
import { useCheckbox } from "@react-aria/checkbox";
import { ToggleProps } from "@react-types/checkbox";

export function Checkbox(props: ToggleProps) {
  let state = useToggleState(props);
  let ref = React.useRef<HTMLInputElement>(null);
  let { inputProps } = useCheckbox(props, state, ref);
  let { children } = props;
  return (
    <div>
      <input {...inputProps} aria-labelledby="1" value="sdfsdf" ref={ref} />;
      <label className="sr-only" id="1">
        This is a cool label
      </label>
    </div>
  );
}
