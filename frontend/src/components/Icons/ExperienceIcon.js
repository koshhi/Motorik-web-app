import * as React from "react"

export default function ExperienceIcon(props) {
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
        d="M1.666 10.833h5V17.5h-5v-6.667zm5.833-4.166h5V17.5h-5V6.667zM13.333 2.5h5v15h-5v-15zm-10 10v3.333h1.666V12.5H3.333zm11.666-8.333v11.666h1.667V4.167h-1.667zM9.166 8.333v7.5h1.667v-7.5H9.166z"
        fill={props.fill}
      />
    </svg>
  )
}


