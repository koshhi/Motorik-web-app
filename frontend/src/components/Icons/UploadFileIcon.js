import * as React from "react"

export default function UploadFileIcon(props) {
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
        d="M5.834 17.484a5.417 5.417 0 01-2.447-10 6.668 6.668 0 0113.227 0 5.416 5.416 0 01-2.447 10v.016H5.834v-.016zm5-6.65h2.5l-3.333-4.167-3.334 4.166h2.5v3.334h1.667v-3.334z"
        fill={props.fill}
      />
    </svg>
  )
}

