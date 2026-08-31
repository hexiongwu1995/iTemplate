#import "itemplate.typ": *
// #import "@preview/iTemplate: 0.3.0": *
#show: contents => itemplate(title: "iTemplate", contents)

= #lorem(3)

#lorem(10)

== #lorem(3)

#lorem(10)

= #lorem(3)

#lorem(10)

== #lorem(3)

#lorem(10)

#html.elem("div", attrs: (
  style: "background: white; margin-top: 50px; width: 100%; height: 30vh",
  id: "three-orbital-cube",
))[]
#html.script(
  type: "module",
  src: "https://unpkg.com/@hexiongwu1995/itemplate@0.3.1/examples/theoframe/three-orbital-cube.js",
)




