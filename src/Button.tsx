import React, { useRef } from "react";
import { useButton } from "@react-aria/button";
import { AriaButtonProps } from "@react-types/button";

export function Button(props: AriaButtonProps<"button">) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  let { children } = props;

  return (
    <button
      {...buttonProps}
      className="bg-blue-600 hover:bg-blue-700 transition-colors text-white py-1 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
      ref={ref}
    >
      {children}
    </button>
  );
}
