#import "itemplate.typ": *
// #import "@preview/itemplate: 0.1.0": *
#show: contents => itemplate(title: "在球面上旋转的向量", contents)

= #lorem(3)

#lorem(20)

== #lorem(3)

#lorem(20)


#block(
  html.div(
    style: "position: relative;",
    class: "canvas-wrapper",
    html.canvas(
      style: "width: 100%;aspect-ratio: 1.25; margin: 0 auto; position: relative;",
      id: "canvas-vector-on-a-sphere",
    ),
  ),
)

#html.script(
  type: "module",
  src: "./main.js",
)


= #lorem(3)

#lorem(20)


== #lorem(3)

#lorem(20)


