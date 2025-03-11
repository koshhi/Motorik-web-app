import * as React from "react"

export default function TicketsIcon(props) {
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
        d="M17.5 2.5a.833.833 0 01.833.833v4.584a2.083 2.083 0 100 4.166v4.584a.833.833 0 01-.834.833h-15a.833.833 0 01-.833-.833v-4.584a2.083 2.083 0 000-4.166V3.333a.833.833 0 01.833-.833h15zm-.834 1.667H3.333V6.64l.13.067a3.75 3.75 0 011.95 3.117l.003.176a3.75 3.75 0 01-1.953 3.292l-.13.068v2.473h13.333V13.36l-.13-.066a3.75 3.75 0 01-1.95-3.117L14.583 10c0-1.42.789-2.656 1.953-3.292l.13-.069V4.167z"
        fill={props.fill}
      />
    </svg>
  )
}
