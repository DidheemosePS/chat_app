"use client";

import { FC, SVGProps } from "react";

// Reuseable buttons are defined here
export function ReUseableButtons({
  Icon,
  style,
  iconStyle,
  functionCall,
}: {
  Icon: FC<SVGProps<SVGElement>>;
  style: string;
  iconStyle?: string;
  functionCall?: () => void;
}) {
  return (
    <button className={style} onClick={functionCall}>
      <Icon className={iconStyle} />
    </button>
  );
}
