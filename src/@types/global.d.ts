declare const __PATH_PREFIX__: string

interface Window {
  iframely: {
    load: () => void
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
