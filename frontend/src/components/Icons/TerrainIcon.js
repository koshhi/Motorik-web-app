import * as React from "react"

export default function TerrainIcon(props) {
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
        d="M1.667 3.333h16.667M2.5 6.675l.008-.01M2.5 13.342l.008-.01M5 10.008L5.008 10M5 16.675l.008-.01M7.5 6.675l.008-.01M7.5 13.342l.008-.01M10 10.008l.008-.009M10 16.675l.008-.01M12.5 6.675l.008-.01M12.5 13.342l.008-.01M15 10.008l.008-.009M15 16.675l.008-.01M17.5 6.675l.008-.01M17.5 13.342l.008-.01"
        stroke={props.fill}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
