import React from "react";
import { useProgressBar } from "@react-aria/progress";
import { ProgressBarProps } from "@react-types/progress";

export function ProgressBar(props: ProgressBarProps) {
  let {
    label,
    showValueLabel = !!label,
    value = 0,
    minValue = 0,
    maxValue = 100,
  } = props;
  let { progressBarProps, labelProps } = useProgressBar(props);

  // Calculate the width of the progress bar as a percentage
  let percentage = (value - minValue) / (maxValue - minValue);
  let barWidth = `${Math.round(percentage * 100)}%`;

  return (
    <div {...progressBarProps} className="w-64">
      <div className="flex justify-between">
        {label && <span {...labelProps}>{label}</span>}
        {showValueLabel && <span>{progressBarProps["aria-valuetext"]}</span>}
      </div>
      <div className="h-2 bg-gray-200">
        <div className="h-2 bg-yellow-400" style={{ width: barWidth }} />
      </div>
    </div>
  );
}
