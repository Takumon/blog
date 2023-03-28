import React from "react"
import ReactDOM from "react-dom"

const name = "Brian"

// highlight-range{2-3}
ReactDOM.render(
  <div><h1>Hello, ${name}!</h1></div>,
  document.getElementById("root")
);