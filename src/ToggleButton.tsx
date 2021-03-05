import React, { useRef } from "react";
import { useToggleState } from "@react-stately/toggle";
import { useToggleButton } from "@react-aria/button";
import { AriaToggleButtonProps } from "@react-types/button";
import { useFocusVisible } from "@react-aria/interactions";
import cn from "classnames";

export function ToggleButton(props: AriaToggleButtonProps<"button">) {
  let ref = useRef(null);
  let state = useToggleState(props);
  let { buttonProps, isPressed } = useToggleButton(props, state, ref);
  let { isFocusVisible } = useFocusVisible({});

  return (
    <button
      {...buttonProps}
      className={cn(
        state.isSelected ? "bg-indigo-600" : "bg-gray-200",
        "focus:outline-none relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200",
        {
          " focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500": isFocusVisible,
        }
      )}
      ref={ref}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={cn(
          state.isSelected ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200",
          "focus:outline-none"
        )}
      ></span>
    </button>
  );
}
