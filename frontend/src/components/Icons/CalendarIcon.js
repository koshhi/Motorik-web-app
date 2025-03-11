import * as React from "react"

export default function CalendarIcon(props) {
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
        d="M14.166 2.5h3.333a.833.833 0 01.834.833v13.334a.833.833 0 01-.834.833h-15a.834.834 0 01-.833-.833V3.333a.833.833 0 01.833-.833h3.334V.833h1.666V2.5h5V.833h1.667V2.5zm-10.833 5v8.333h13.333V7.5H3.333zm1.666 3.333h4.167v3.334H4.999v-3.334z"
        fill={props.fill}
      />
    </svg>
  )
}
