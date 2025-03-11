import * as React from "react"

export default function OptionIcon(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.167 13.333a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm0 0h7.5m-5.833-6.666a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0zm0 0h-7.5"
        stroke={props.stroke}
        strokeWidth={2}
      />
    </svg>
  )
}