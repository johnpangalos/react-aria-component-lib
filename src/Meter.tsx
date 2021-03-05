import React from "react";
import { useMeter } from "@react-aria/meter";
import { AriaMeterProps } from "@react-types/meter";
export function Meter(props: AriaMeterProps) {
  let {
    label,
    showValueLabel = !!label,
    value = 0,
    minValue = 0,
    maxValue = 100,
  } = props;
  let { meterProps, labelProps } = useMeter(props);

  // Calculate the width of the progress bar as a percentage
  let percentage = (value - minValue) / (maxValue - minValue);
  let barWidth = `${Math.round(percentage * 100)}%`;

  return (
    <div {...meterProps} className="w-64">
      <div className="flex justify-between">
        {label && <span {...labelProps}>{label}</span>}
        {showValueLabel && <span>{meterProps["aria-valuetext"]}</span>}
      </div>
      <div className="bg-gray-100 h-2">
        <div className="h-2 bg-green-200" style={{ width: barWidth }} />
      </div>
    </div>
  );
}
