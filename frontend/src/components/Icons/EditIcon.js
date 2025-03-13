import * as React from "react"

export default function EditIcon(props) {
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
        d="M13.107 8.072l-1.179-1.179-7.761 7.762v1.178h1.178l7.762-7.761zm1.178-1.179l1.178-1.178-1.178-1.178-1.178 1.178 1.178 1.178zM6.035 17.5H2.5v-3.536L13.696 2.768a.833.833 0 011.178 0l2.358 2.358a.833.833 0 010 1.178L6.036 17.5h-.001z"
        fill={props.fill}
      />
    </svg>
  )
}
