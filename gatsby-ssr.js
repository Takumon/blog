const { setPreBodyComponents } = require("react-dom/server")
const React = require('react');

exports.replaceRenderer = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <noscript>本ブログはJavaScriptが前提となっております。JavaScriptを有効にしてください。</noscript>
  ])
}