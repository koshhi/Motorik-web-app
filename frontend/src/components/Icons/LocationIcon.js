import * as React from "react"

export default function LocationIcon(props) {
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
        d="M15.303 14.47L10 19.773 4.697 14.47a7.5 7.5 0 1110.606 0zM10 10.833A1.666 1.666 0 1010 7.5a1.666 1.666 0 000 3.333z"
        fill={props.fill}
      />
    </svg>
  )
}
