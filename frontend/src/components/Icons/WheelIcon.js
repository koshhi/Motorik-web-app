import * as React from "react"

export default function WheelIcon(props) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 10a5 5 0 11-10 0 5 5 0 0110 0zm-1.667 0a3.32 3.32 0 01-.763 2.122l-1.223-1.682 1.98-.644c.004.067.006.136.006.204zm-3.334 1.42l1.223 1.682c-.378.15-.79.231-1.223.231-.431 0-.844-.082-1.222-.231l1.222-1.681zM6.666 10c0 .806.286 1.546.762 2.122l1.226-1.685-1.982-.642a3.387 3.387 0 00-.006.205zm2.498-1.15l-1.977-.64a3.339 3.339 0 011.978-1.438V8.85zm1.667.006l.001-2.084a3.339 3.339 0 011.98 1.439l-1.981.645zm-.832 1.977a.833.833 0 100-1.666.833.833 0 000 1.666z"
        fill={props.fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.333 10a8.333 8.333 0 11-16.667 0 8.333 8.333 0 0116.667 0zm-1.667 0a6.667 6.667 0 11-13.333 0 6.667 6.667 0 0113.333 0z"
        fill={props.fill}
      />
    </svg>
  )
}
