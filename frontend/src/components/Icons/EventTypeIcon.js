import * as React from "react"

export default function EventTypeIcon(props) {
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
        d="M10.834 14.115v1.718h4.167V17.5H5v-1.667h4.166v-1.718A6.668 6.668 0 013.334 7.5v-5h13.333v5a6.667 6.667 0 01-5.833 6.615zM5.001 4.167V7.5a5 5 0 1010 0V4.167H5zm-4.167 0h1.667V7.5H.834V4.167zm16.667 0h1.666V7.5h-1.666V4.167z"
        fill={props.fill}
      />
    </svg>
  )
}
